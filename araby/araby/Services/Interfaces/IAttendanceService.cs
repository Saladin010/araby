using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<AttendanceDto> RecordAttendanceAsync(CreateAttendanceDto dto, string recordedById);
        Task<IEnumerable<AttendanceDto>> GetAllAttendanceAsync();
        Task<IEnumerable<AttendanceDto>> GetAttendanceBySessionIdAsync(int sessionId);
        Task<IEnumerable<AttendanceDto>> GetAttendanceBySessionIdAndDateAsync(int sessionId, DateTime date);
        Task<IEnumerable<AttendanceDto>> GetAttendanceByStudentIdAsync(string studentId);
        Task<bool> UpdateAttendanceAsync(int attendanceId, UpdateAttendanceDto dto);
        Task<AttendanceStatisticsDto> GetStudentAttendanceStatisticsAsync(string studentId);
        Task<AttendanceStatisticsDto> GetOverallAttendanceStatisticsAsync();
        Task MarkAbsentForCompletedSessionsAsync();
        /// <summary>
        /// Creates absentee records for all students enrolled in today's active sessions (regular and recurring).
        /// Should be run daily at the beginning of the day (e.g., 00:01 AM).
        /// </summary>
        Task MarkAbsentForTodaySessionsAsync();
    }
}
