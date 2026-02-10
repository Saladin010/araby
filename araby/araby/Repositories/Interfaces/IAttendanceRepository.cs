using araby.DTOs;
using araby.Models;

namespace araby.Repositories.Interfaces
{
    public interface IAttendanceRepository : IGenericRepository<Attendance>
    {
        Task<IEnumerable<Attendance>> GetBySessionIdAsync(int sessionId);
        Task<IEnumerable<Attendance>> GetBySessionIdAndDateAsync(int sessionId, DateTime date);
        Task<IEnumerable<Attendance>> GetByStudentIdAsync(string studentId);
        Task<AttendanceStatisticsDto> GetStudentStatisticsAsync(string studentId);
    }
}
