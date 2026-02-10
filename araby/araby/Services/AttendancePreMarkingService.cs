using araby.Data;
using araby.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace araby.Services
{
    /// <summary>
    /// Background service for automatically pre-marking attendance records
    /// Runs periodically to create Absent records for all students in started sessions
    /// </summary>
    public class AttendancePreMarkingService : IHostedService, IDisposable
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AttendancePreMarkingService> _logger;
        private readonly AttendanceSettings _settings;
        private Timer? _timer;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public AttendancePreMarkingService(
            IServiceProvider serviceProvider,
            ILogger<AttendancePreMarkingService> logger,
            IOptions<AttendanceSettings> settings)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _settings = settings.Value;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Attendance Pre-Marking Service starting...");
            
            // Start timer with configured interval
            var intervalMs = _settings.PreMarkingIntervalMinutes * 60 * 1000;
            _timer = new Timer(
                DoWork,
                null,
                TimeSpan.Zero, // Start immediately
                TimeSpan.FromMilliseconds(intervalMs));

            return Task.CompletedTask;
        }

        private async void DoWork(object? state)
        {
            try
            {
                _logger.LogInformation("Running attendance pre-marking check...");
                await PreMarkAttendanceAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while pre-marking attendance");
            }
        }

        private async Task PreMarkAttendanceAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            var today = egyptNow.Date;
            var dayOfWeek = (int)egyptNow.DayOfWeek;

            _logger.LogInformation("[PRE-MARK] Starting check - Date: {Date}, Time: {Time}, DayOfWeek: {Day}", 
                today, egyptNow.TimeOfDay, dayOfWeek);

            // Load all sessions with their enrollments
            var allSessions = await context.Sessions
                .Include(s => s.SessionStudents)
                .Include(s => s.SessionGroups)
                    .ThenInclude(sg => sg.StudentGroup)
                        .ThenInclude(g => g!.Members)
                .ToListAsync();

            _logger.LogInformation("[PRE-MARK] Found {Total} total sessions in database", allSessions.Count);

            var sessionsToProcess = new List<Session>();

            // CRITICAL: State-based logic (not time-window)
            // Pre-mark if: session has started AND no attendance records exist yet
            foreach (var session in allSessions)
            {
                DateTime sessionStartTime;
                bool shouldProcess = false;

                if (!session.IsRecurring)
                {
                    // Normal session: check if today and started
                    if (session.StartTime.Date == today)
                    {
                        sessionStartTime = session.StartTime;
                        shouldProcess = sessionStartTime <= egyptNow;
                    }
                }
                else if (!string.IsNullOrEmpty(session.RecurringPattern))
                {
                    // Recurring session: check if today is a recurring day and session started
                    try
                    {
                        var pattern = System.Text.Json.JsonSerializer.Deserialize<RecurringPattern>(session.RecurringPattern);
                        if (pattern != null && pattern.DaysOfWeek.Contains(dayOfWeek))
                        {
                            // Check date range
                            if (session.StartTime.Date <= today &&
                                (!pattern.EndDate.HasValue || today <= pattern.EndDate.Value.Date))
                            {
                                // Calculate session start time for today
                                sessionStartTime = today.Add(session.StartTime.TimeOfDay);
                                shouldProcess = sessionStartTime <= egyptNow;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to parse recurring pattern for session {SessionId}", session.Id);
                    }
                }

                if (shouldProcess)
                {
                    // Always add session for processing
                    // We'll check per-student attendance in PreMarkSessionAsync
                    sessionsToProcess.Add(session);
                    _logger.LogInformation("[PRE-MARK] ✅ Session {SessionId} '{Title}' will be processed (Started: {Started})", 
                        session.Id, session.Title, shouldProcess);
                }
                else
                {
                    _logger.LogDebug("[PRE-MARK] ⏭️ Session {SessionId} '{Title}' skipped (not started yet)", 
                        session.Id, session.Title);
                }
            }

            if (sessionsToProcess.Count == 0)
            {
                _logger.LogInformation("[PRE-MARK] ℹ️ No sessions need pre-marking at this time (checked {Total} sessions)", allSessions.Count);
                return;
            }

            _logger.LogInformation("[PRE-MARK] 🚀 Pre-marking {Count} sessions", sessionsToProcess.Count);

            // Pre-mark attendance for each session
            foreach (var session in sessionsToProcess)
            {
                await PreMarkSessionAsync(context, session, today, egyptNow);
            }

            await context.SaveChangesAsync();
            _logger.LogInformation("Pre-marking completed successfully");
        }

        private async Task PreMarkSessionAsync(
            ApplicationDbContext context,
            Session session,
            DateTime sessionDate,
            DateTime recordedAt)
        {
            // ✅ FIX: Get a valid system user (teacher) for RecordedBy
            var systemUser = await context.Users
                .Where(u => u.Role == UserRole.Teacher)
                .OrderBy(u => u.CreatedAt)
                .FirstOrDefaultAsync();

            if (systemUser == null)
            {
                _logger.LogError("[PRE-MARK] ❌ No teacher user found in the system. Cannot create attendance records.");
                return;
            }

            _logger.LogInformation("[PRE-MARK] ✅ Using system user: {UserName} (ID: {UserId})", 
                systemUser.UserName, systemUser.Id);

            // Collect all enrolled students
            var studentIds = new HashSet<string>();

            // Individual students
            foreach (var ss in session.SessionStudents)
            {
                studentIds.Add(ss.StudentId);
            }

            // Group students
            foreach (var sg in session.SessionGroups)
            {
                if (sg.StudentGroup?.Members != null)
                {
                    foreach (var member in sg.StudentGroup.Members)
                    {
                        studentIds.Add(member.StudentId);
                    }
                }
            }

            if (studentIds.Count == 0)
            {
                _logger.LogWarning("[PRE-MARK] ⚠️ Session {SessionId} '{Title}' has NO enrolled students!", 
                    session.Id, session.Title);
                return;
            }

            _logger.LogInformation("[PRE-MARK] 📝 Session {SessionId}: Found {Count} enrolled students", 
                session.Id, studentIds.Count);

            var createdCount = 0;
            var skippedCount = 0;
            var attendancesToAdd = new List<Attendance>();

            foreach (var studentId in studentIds)
            {
                try
                {
                    // Check if student already has attendance for this session today
                    var existingAttendance = await context.Attendances
                        .AnyAsync(a => a.SessionId == session.Id && 
                                      a.StudentId == studentId && 
                                      a.SessionDate == sessionDate);

                    if (!existingAttendance)
                    {
                        // Only create if no attendance exists for this student
                        var attendance = new Attendance
                        {
                            SessionId = session.Id,
                            StudentId = studentId,
                            SessionDate = sessionDate,
                            Status = AttendanceStatus.Absent,
                            RecordedAt = recordedAt,
                            RecordedBy = systemUser.Id,  // ✅ FIX: Use actual admin user ID
                            Notes = "Pre-marked automatically at session start"
                        };

                        attendancesToAdd.Add(attendance);
                        createdCount++;
                    }
                    else
                    {
                        skippedCount++;
                        _logger.LogDebug("Student {StudentId} already has attendance for Session {SessionId}",
                            studentId, session.Id);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error checking attendance for SessionId={SessionId}, StudentId={StudentId}",
                        session.Id, studentId);
                }
            }

            // Batch save all new attendance records
            if (attendancesToAdd.Count > 0)
            {
                try
                {
                    context.Attendances.AddRange(attendancesToAdd);
                    await context.SaveChangesAsync();
                }
                catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("IX_Attendance_SessionStudent_Date") == true)
                {
                    // Race condition: some records were created between our check and save
                    // This is rare but possible, log it
                    _logger.LogWarning(ex, "Race condition detected while batch saving attendance for Session {SessionId}",
                        session.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to batch save attendance for Session {SessionId}",
                        session.Id);
                }
            }

            _logger.LogInformation("[PRE-MARK] ✅ Session {SessionId}: Created {Created}, Skipped {Skipped} attendance records (Total: {Total})",
                session.Id, createdCount, skippedCount, studentIds.Count);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Attendance Pre-Marking Service stopping...");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
