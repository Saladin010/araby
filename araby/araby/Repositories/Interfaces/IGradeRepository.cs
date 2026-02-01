using araby.DTOs;
using araby.Models;

namespace araby.Repositories.Interfaces
{
    public interface IGradeRepository : IGenericRepository<Grade>
    {
        Task<IEnumerable<Grade>> GetByStudentIdAsync(string studentId);
        Task<GradeStatisticsDto> GetStudentStatisticsAsync(string studentId);
    }
}
