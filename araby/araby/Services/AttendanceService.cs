using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using araby.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace araby.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public AttendanceService(IAttendanceRepository attendanceRepository, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _attendanceRepository = attendanceRepository;
            _context = context;
            _userManager = userManager;
        }

        public async Task<AttendanceDto> RecordAttendanceAsync(CreateAttendanceDto dto, string recordedById)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            var sessionDate = dto.SessionDate?.Date ?? egyptNow.Date;

            // Check if attendance already exists for this session+student+date
            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.SessionId == dto.SessionId && 
                                          a.StudentId == dto.StudentId && 
                                          a.SessionDate == sessionDate);

            if (existingAttendance != null)
            {
                // UPDATE existing record
                existingAttendance.Status = dto.Status;
                existingAttendance.Notes = dto.Notes;
                existingAttendance.RecordedAt = egyptNow;
                existingAttendance.RecordedBy = recordedById;

                await _context.SaveChangesAsync();
                return await MapToAttendanceDtoAsync(existingAttendance);
            }
            else
            {
                // CREATE new record
                var attendance = new Attendance
                {
                    SessionId = dto.SessionId,
                    StudentId = dto.StudentId,
                    SessionDate = sessionDate,
                    Status = dto.Status,
                    RecordedAt = egyptNow,
                    RecordedBy = recordedById,
                    Notes = dto.Notes
                };

                _context.Attendances.Add(attendance);
                await _context.SaveChangesAsync();
                return await MapToAttendanceDtoAsync(attendance);
            }
        }

        public async Task<IEnumerable<AttendanceDto>> GetAllAttendanceAsync()
        {
            var attendances = await _attendanceRepository.GetAllAsync();
            var attendanceDtos = new List<AttendanceDto>();

            foreach (var attendance in attendances)
            {
                attendanceDtos.Add(await MapToAttendanceDtoAsync(attendance));
            }

            return attendanceDtos;
        }

        public async Task<IEnumerable<AttendanceDto>> GetAttendanceBySessionIdAsync(int sessionId)
        {
            var attendances = await _attendanceRepository.GetBySessionIdAsync(sessionId);
            var attendanceDtos = new List<AttendanceDto>();

            foreach (var attendance in attendances)
            {
                attendanceDtos.Add(await MapToAttendanceDtoAsync(attendance));
            }

            return attendanceDtos;
        }

        public async Task<IEnumerable<AttendanceDto>> GetAttendanceBySessionIdAndDateAsync(int sessionId, DateTime date)
        {
            var attendances = await _attendanceRepository.GetBySessionIdAndDateAsync(sessionId, date);
            var attendanceDtos = new List<AttendanceDto>();

            foreach (var attendance in attendances)
            {
                attendanceDtos.Add(await MapToAttendanceDtoAsync(attendance));
            }

            return attendanceDtos;
        }

        public async Task<IEnumerable<AttendanceDto>> GetAttendanceByStudentIdAsync(string studentId)
        {
            var attendances = await _attendanceRepository.GetByStudentIdAsync(studentId);
            var attendanceDtos = new List<AttendanceDto>();

            foreach (var attendance in attendances)
            {
                attendanceDtos.Add(await MapToAttendanceDtoAsync(attendance));
            }

            return attendanceDtos;
        }

        public async Task<bool> UpdateAttendanceAsync(int attendanceId, UpdateAttendanceDto dto)
        {
            var attendance = await _attendanceRepository.GetByIdAsync(attendanceId);
            if (attendance == null)
            {
                return false;
            }

            attendance.Status = dto.Status;
            attendance.Notes = dto.Notes;

            await _attendanceRepository.UpdateAsync(attendance);
            return true;
        }

        public async Task<AttendanceStatisticsDto> GetStudentAttendanceStatisticsAsync(string studentId)
        {
            return await _attendanceRepository.GetStudentStatisticsAsync(studentId);
        }

        public async Task<AttendanceStatisticsDto> GetOverallAttendanceStatisticsAsync()
        {
            var allAttendances = await _attendanceRepository.GetAllAsync();

            var totalSessions = allAttendances.Count();
            var presentCount = allAttendances.Count(a => a.Status == AttendanceStatus.Present);
            var absentCount = allAttendances.Count(a => a.Status == AttendanceStatus.Absent);
            var lateCount = allAttendances.Count(a => a.Status == AttendanceStatus.Late);
            var excusedCount = allAttendances.Count(a => a.Status == AttendanceStatus.Excused);

            var attendancePercentage = totalSessions > 0
                ? Math.Round((decimal)presentCount / totalSessions * 100, 2)
                : 0;

            return new AttendanceStatisticsDto
            {
                TotalSessions = totalSessions,
                PresentCount = presentCount,
                AbsentCount = absentCount,
                LateCount = lateCount,
                ExcusedCount = excusedCount,
                AttendancePercentage = attendancePercentage
            };
        }

        private async Task<AttendanceDto> MapToAttendanceDtoAsync(Attendance attendance)
        {
            var student = await _userManager.FindByIdAsync(attendance.StudentId);
            var recordedBy = await _userManager.FindByIdAsync(attendance.RecordedBy);

            return new AttendanceDto
            {
                Id = attendance.Id,
                SessionId = attendance.SessionId,
                SessionTitle = attendance.Session?.Title ?? "",
                StudentId = attendance.StudentId,
                StudentNumber = student?.StudentNumber?.ToString() ?? "",
                StudentName = student?.FullName ?? "",
                SessionDate = attendance.SessionDate,
                Status = attendance.Status,
                RecordedAt = attendance.RecordedAt,
                RecordedBy = attendance.RecordedBy,
                RecordedByName = recordedBy?.FullName ?? "",
                Notes = attendance.Notes
            };
        }

        public async Task MarkAbsentForCompletedSessionsAsync()
        {
            // This method might be deprecated in favor of pre-marking, 
            // but we can keep it for safety or cleanup if needed.
            // For now, let's leave it as is or update it to respect SessionDate if we use it.
            // ... implementation can be updated later if needed.
            await Task.CompletedTask;
        }

        public async Task MarkAbsentForTodaySessionsAsync()
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            var today = egyptNow.Date; // 00:00:00 today
            var dayOfWeek = (int)egyptNow.DayOfWeek;

            // 1. Get all potential sessions for today with students
            var allSessions = await _context.Sessions
                .Include(s => s.SessionStudents)
                .Include(s => s.SessionGroups)
                    .ThenInclude(sg => sg.StudentGroup)
                        .ThenInclude(g => g.Members)
                .ToListAsync();

            var todaySessions = new List<Session>();

            // 2. Filter for today's active sessions
            foreach (var session in allSessions)
            {
                if (!session.IsRecurring)
                {
                    if (session.StartTime.Date == today)
                    {
                        todaySessions.Add(session);
                    }
                }
                else if (!string.IsNullOrEmpty(session.RecurringPattern))
                {
                    try
                    {
                        var pattern = System.Text.Json.JsonSerializer.Deserialize<RecurringPattern>(session.RecurringPattern);
                        if (pattern != null && pattern.DaysOfWeek.Contains(dayOfWeek))
                        {
                            if (session.StartTime.Date <= today && 
                                (!pattern.EndDate.HasValue || today <= pattern.EndDate.Value.Date))
                            {
                                todaySessions.Add(session);
                            }
                        }
                    }
                    catch
                    {
                        // Ignore invalid patterns
                    }
                }
            }

            // 3. Create absent records
            foreach (var session in todaySessions)
            {
                // Collect all student IDs (distinct)
                var studentIds = new HashSet<string>();
                
                // Add individual students
                foreach (var ss in session.SessionStudents)
                {
                    studentIds.Add(ss.StudentId);
                }

                // Add group students
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

                // Create attendance records
                foreach (var studentId in studentIds)
                {
                    // Check if already exists for today
                    var exists = await _context.Attendances
                        .AnyAsync(a => a.SessionId == session.Id && 
                                      a.StudentId == studentId && 
                                      a.SessionDate == today);

                    if (!exists)
                    {
                        var attendance = new Attendance
                        {
                            SessionId = session.Id,
                            StudentId = studentId,
                            SessionDate = today,
                            Status = AttendanceStatus.Absent,
                            RecordedAt = egyptNow,
                            RecordedBy = "System", // Can be a system user ID or specific string
                            Notes = "تم التسجيل تلقائياً - في انتظار المسح"
                        };

                        _context.Attendances.Add(attendance);
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
