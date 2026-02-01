using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface IGradeService
    {
        Task<GradeDto> CreateGradeAsync(CreateGradeDto dto, string recordedById);
        Task<IEnumerable<GradeDto>> GetAllGradesAsync();
        Task<IEnumerable<GradeDto>> GetGradesByStudentIdAsync(string studentId);
        Task<GradeDto> GetGradeByIdAsync(int gradeId);
        Task<bool> UpdateGradeAsync(int gradeId, UpdateGradeDto dto);
        Task<bool> DeleteGradeAsync(int gradeId);
        Task<GradeStatisticsDto> GetStudentGradeStatisticsAsync(string studentId);
    }
}
