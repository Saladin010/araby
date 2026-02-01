using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace araby.Services
{
    public class GradeService : IGradeService
    {
        private readonly IGradeRepository _gradeRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public GradeService(IGradeRepository gradeRepository, UserManager<ApplicationUser> userManager)
        {
            _gradeRepository = gradeRepository;
            _userManager = userManager;
        }

        public async Task<GradeDto> CreateGradeAsync(CreateGradeDto dto, string recordedById)
        {
            // Validate Score <= MaxScore
            if (dto.Score > dto.MaxScore)
            {
                return null;
            }

            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            var grade = new Grade
            {
                StudentId = dto.StudentId,
                ExamName = dto.ExamName,
                Score = dto.Score,
                MaxScore = dto.MaxScore,
                ExamDate = dto.ExamDate,
                Notes = dto.Notes,
                RecordedBy = recordedById,
                RecordedAt = egyptNow
            };

            var createdGrade = await _gradeRepository.AddAsync(grade);
            
            // Load related entities for mapping
            var fullGrade = await _gradeRepository.GetByIdAsync(createdGrade.Id);
            return await MapToGradeDtoAsync(fullGrade);
        }

        public async Task<IEnumerable<GradeDto>> GetAllGradesAsync()
        {
            var grades = await _gradeRepository.GetAllAsync();
            var gradeDtos = new List<GradeDto>();

            foreach (var grade in grades)
            {
                gradeDtos.Add(await MapToGradeDtoAsync(grade));
            }

            return gradeDtos;
        }

        public async Task<IEnumerable<GradeDto>> GetGradesByStudentIdAsync(string studentId)
        {
            var grades = await _gradeRepository.GetByStudentIdAsync(studentId);
            var gradeDtos = new List<GradeDto>();

            foreach (var grade in grades)
            {
                gradeDtos.Add(await MapToGradeDtoAsync(grade));
            }

            return gradeDtos;
        }

        public async Task<GradeDto> GetGradeByIdAsync(int gradeId)
        {
            var grade = await _gradeRepository.GetByIdAsync(gradeId);
            if (grade == null)
            {
                return null;
            }

            return await MapToGradeDtoAsync(grade);
        }

        public async Task<bool> UpdateGradeAsync(int gradeId, UpdateGradeDto dto)
        {
            var grade = await _gradeRepository.GetByIdAsync(gradeId);
            if (grade == null)
            {
                return false;
            }

            // Validate Score <= MaxScore
            if (dto.Score > dto.MaxScore)
            {
                return false;
            }

            grade.ExamName = dto.ExamName;
            grade.Score = dto.Score;
            grade.MaxScore = dto.MaxScore;
            grade.ExamDate = dto.ExamDate;
            grade.Notes = dto.Notes;

            await _gradeRepository.UpdateAsync(grade);
            return true;
        }

        public async Task<bool> DeleteGradeAsync(int gradeId)
        {
            var grade = await _gradeRepository.GetByIdAsync(gradeId);
            if (grade == null)
            {
                return false;
            }

            await _gradeRepository.DeleteAsync(grade);
            return true;
        }

        public async Task<GradeStatisticsDto> GetStudentGradeStatisticsAsync(string studentId)
        {
            return await _gradeRepository.GetStudentStatisticsAsync(studentId);
        }

        private async Task<GradeDto> MapToGradeDtoAsync(Grade grade)
        {
            var student = await _userManager.FindByIdAsync(grade.StudentId);
            var recordedBy = await _userManager.FindByIdAsync(grade.RecordedBy);

            var percentage = grade.MaxScore > 0
                ? Math.Round((grade.Score / grade.MaxScore) * 100, 2)
                : 0;

            return new GradeDto
            {
                Id = grade.Id,
                StudentId = grade.StudentId,
                StudentName = student?.FullName ?? "",
                ExamName = grade.ExamName,
                Score = grade.Score,
                MaxScore = grade.MaxScore,
                Percentage = percentage,
                ExamDate = grade.ExamDate,
                Notes = grade.Notes,
                RecordedBy = grade.RecordedBy,
                RecordedByName = recordedBy?.FullName ?? "",
                RecordedAt = grade.RecordedAt
            };
        }
    }
}
