using araby.Data;
using araby.DTOs.QRCode;
using araby.Models;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace araby.Services
{
    public class QRCodeService : IQRCodeService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly AttendanceSettings _settings;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public QRCodeService(
            UserManager<ApplicationUser> userManager, 
            ApplicationDbContext context,
            IOptions<AttendanceSettings> settings)
        {
            _userManager = userManager;
            _context = context;
            _settings = settings.Value;
        }

        /// <summary>
        /// Get student QR code data by student ID
        /// </summary>
        public async Task<StudentQRDataDto?> GetStudentQRDataAsync(string studentId)
        {
            var student = await _userManager.FindByIdAsync(studentId);
            
            if (student == null || student.Role != UserRole.Student)
            {
                return null;
            }

            if (!student.StudentNumber.HasValue)
            {
                return null;
            }

            return new StudentQRDataDto
            {
                StudentId = student.Id,
                StudentNumber = student.StudentNumber.Value,
                FullName = student.FullName,
                AcademicLevel = student.AcademicLevel
            };
        }

        /// <summary>
        /// Scan QR code and record attendance
        /// </summary>
        public async Task<QRCodeAttendanceResultDto> ScanQRCodeAsync(QRCodeScanDto scanDto, string scannedBy)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            // Use current time for validation if scan time is not provided or significantly different
            // But usually trust the server time for attendance logic
            var checkTime = egyptNow; 
            var today = egyptNow.Date;
            var dayOfWeek = (int)egyptNow.DayOfWeek;

            // 1. Find student by StudentNumber
            var student = await _userManager.Users
                .FirstOrDefaultAsync(u => u.StudentNumber == scanDto.StudentNumber);

            if (student == null)
            {
                return new QRCodeAttendanceResultDto
                {
                    Success = false,
                    Message = "رقم الطالب غير صحيح"
                };
            }

            // 2. Find active or upcoming session (allow early scanning)
            var earlyScanWindow = _settings.AllowEarlyScan ? _settings.EarlyScanMinutes : 0;
            
            // A. Regular Session
            var activeSession = await _context.Sessions
                .Include(s => s.SessionStudents)
                .Where(s => !s.IsRecurring &&
                            (string.IsNullOrEmpty(s.AcademicLevel) || 
                             string.IsNullOrEmpty(student.AcademicLevel) || 
                             s.AcademicLevel == student.AcademicLevel) &&
                            checkTime >= s.StartTime.AddMinutes(-earlyScanWindow) &&
                            checkTime <= s.EndTime)
                .OrderBy(s => s.StartTime)
                .FirstOrDefaultAsync();

            // B. Recurring Session (if no regular session found)
            if (activeSession == null)
            {
                var candidateSessions = await _context.Sessions
                    .Where(s => s.IsRecurring && 
                                !string.IsNullOrEmpty(s.RecurringPattern) &&
                                (string.IsNullOrEmpty(s.AcademicLevel) || 
                                 string.IsNullOrEmpty(student.AcademicLevel) || 
                                 s.AcademicLevel == student.AcademicLevel))
                    .ToListAsync();

                foreach (var session in candidateSessions)
                {
                    try
                    {
                        var pattern = System.Text.Json.JsonSerializer.Deserialize<RecurringPattern>(session.RecurringPattern);
                        if (pattern != null && pattern.DaysOfWeek.Contains(dayOfWeek))
                        {
                            // Check date range
                            if (session.StartTime.Date <= today && 
                                (!pattern.EndDate.HasValue || today <= pattern.EndDate.Value.Date))
                            {
                                // Check time window (using TimeOfDay)
                                var sessionStart = today.Add(session.StartTime.TimeOfDay);
                                var sessionEnd = today.Add(session.EndTime.TimeOfDay);

                                if (checkTime >= sessionStart.AddMinutes(-earlyScanWindow) && checkTime <= sessionEnd)
                                {
                                    activeSession = session;
                                    break; // Found one
                                }
                            }
                        }
                    }
                    catch
                    {
                        // Ignore invalid patterns
                    }
                }
            }

            if (activeSession == null)
            {
                var earlyMessage = _settings.AllowEarlyScan 
                    ? $"يمكن المسح قبل {_settings.EarlyScanMinutes} دقيقة من بداية الحصة." 
                    : "";
                return new QRCodeAttendanceResultDto
                {
                    Success = false,
                    Message = $"لا توجد حصة نشطة أو قادمة حالياً. {earlyMessage}"
                };
            }

            // 3. Determine Status (supports early, on-time, and late)
            // Note: StartTime is already stored in Egypt time from SessionService
            // No need for timezone conversion to avoid double conversion bug
            var sessionStartTime = activeSession.IsRecurring 
                ? today.Add(activeSession.StartTime.TimeOfDay) 
                : activeSession.StartTime;

            var minutesAfterStart = (checkTime - sessionStartTime).TotalMinutes;
            
            AttendanceStatus status;
            string scanNote;
            
            if (minutesAfterStart < 0)
            {
                // Early scan (before session start)
                status = AttendanceStatus.Present;
                scanNote = $"تم المسح مبكراً قبل بداية الحصة ({Math.Abs(minutesAfterStart):F0} دقيقة مبكراً) - {egyptNow:HH:mm}";
            }
            else if (minutesAfterStart <= _settings.OnTimeGraceMinutes)
            {
                // On-time scan
                status = AttendanceStatus.Present;
                scanNote = $"تم المسح عبر QR في {egyptNow:HH:mm}";
            }
            else
            {
                // Late scan
                status = AttendanceStatus.Late;
                scanNote = $"تم المسح متأخراً ({minutesAfterStart:F0} دقيقة تأخير) - {egyptNow:HH:mm}";
            }

            // 4. Find or Create Attendance (Upsert with race condition handling)
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.SessionId == activeSession.Id && 
                                          a.StudentId == student.Id && 
                                          a.SessionDate == today);

            if (attendance != null)
            {
                // UPDATE existing record
                if (attendance.Status == AttendanceStatus.Present || attendance.Status == AttendanceStatus.Late)
                {
                    return new QRCodeAttendanceResultDto
                    {
                        Success = false,
                        Message = "تم تسجيل الحضور مسبقاً لهذه الحصة"
                    };
                }

                // Update from Absent/Excused to Present/Late
                attendance.Status = status;
                attendance.RecordedAt = egyptNow;
                attendance.RecordedBy = scannedBy;
                attendance.Notes = scanNote;
            }
            else
            {
                // INSERT new record (Fallback if pre-marking hasn't happened yet)
                // This ensures QR scanning always works, even if background service missed the session
                attendance = new Attendance
                {
                    SessionId = activeSession.Id,
                    StudentId = student.Id,
                    SessionDate = today,
                    Status = status,
                    RecordedAt = egyptNow,
                    RecordedBy = scannedBy,
                    Notes = scanNote + " (سجل جديد - لم يتم العثور على pre-mark)"
                };
                _context.Attendances.Add(attendance);
            }

            // Save with race condition handling
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("IX_Attendance_SessionStudent_Date") == true)
            {
                // Race condition: another process (background service or another scan) created the record
                // Retry once to fetch and update
                attendance = await _context.Attendances
                    .FirstOrDefaultAsync(a => a.SessionId == activeSession.Id && 
                                              a.StudentId == student.Id && 
                                              a.SessionDate == today);
                
                if (attendance != null)
                {
                    // Check if already scanned
                    if (attendance.Status == AttendanceStatus.Present || attendance.Status == AttendanceStatus.Late)
                    {
                        return new QRCodeAttendanceResultDto
                        {
                            Success = false,
                            Message = "تم تسجيل الحضور مسبقاً لهذه الحصة"
                        };
                    }
                    
                    // Update the record that was created by the other process
                    attendance.Status = status;
                    attendance.RecordedAt = egyptNow;
                    attendance.RecordedBy = scannedBy;
                    attendance.Notes = scanNote + " (تحديث بعد race condition)";
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Very rare: record was deleted between our checks
                    throw;
                }
            }

            return new QRCodeAttendanceResultDto
            {
                Success = true,
                Message = status == AttendanceStatus.Present ? "تم تسجيل الحضور بنجاح" : "تم تسجيل الحضور (متأخر)",
                StudentName = student.FullName,
                SessionTitle = activeSession.Title,
                Status = (int)status,
                ScannedAt = egyptNow
            };
        }
    }
}
