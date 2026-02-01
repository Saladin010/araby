using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace araby.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public AttendanceService(IAttendanceRepository attendanceRepository, UserManager<ApplicationUser> userManager)
        {
            _attendanceRepository = attendanceRepository;
            _userManager = userManager;
        }

        public async Task<AttendanceDto> RecordAttendanceAsync(CreateAttendanceDto dto, string recordedById)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            var attendance = new Attendance
            {
                SessionId = dto.SessionId,
                StudentId = dto.StudentId,
                Status = dto.Status,
                RecordedAt = egyptNow,
                RecordedBy = recordedById,
                Notes = dto.Notes
            };

            var createdAttendance = await _attendanceRepository.AddAsync(attendance);
            
            // Load related entities for mapping
            var fullAttendance = await _attendanceRepository.GetByIdAsync(createdAttendance.Id);
            return await MapToAttendanceDtoAsync(fullAttendance);
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
                StudentName = student?.FullName ?? "",
                Status = attendance.Status,
                RecordedAt = attendance.RecordedAt,
                RecordedBy = attendance.RecordedBy,
                RecordedByName = recordedBy?.FullName ?? "",
                Notes = attendance.Notes
            };
        }
    }
}
