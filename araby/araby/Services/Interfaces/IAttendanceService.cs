using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<AttendanceDto> RecordAttendanceAsync(CreateAttendanceDto dto, string recordedById);
        Task<IEnumerable<AttendanceDto>> GetAllAttendanceAsync();
        Task<IEnumerable<AttendanceDto>> GetAttendanceBySessionIdAsync(int sessionId);
        Task<IEnumerable<AttendanceDto>> GetAttendanceByStudentIdAsync(string studentId);
        Task<bool> UpdateAttendanceAsync(int attendanceId, UpdateAttendanceDto dto);
        Task<AttendanceStatisticsDto> GetStudentAttendanceStatisticsAsync(string studentId);
        Task<AttendanceStatisticsDto> GetOverallAttendanceStatisticsAsync();
    }
}
