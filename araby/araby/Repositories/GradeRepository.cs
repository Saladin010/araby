using araby.Data;
using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Repositories
{
    public class GradeRepository : GenericRepository<Grade>, IGradeRepository
    {
        public GradeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Grade>> GetAllAsync()
        {
            return await _dbSet
                .Include(g => g.Student)
                .Include(g => g.RecordedByUser)
                .OrderByDescending(g => g.ExamDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Grade>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet
                .Include(g => g.Student)
                .Include(g => g.RecordedByUser)
                .Where(g => g.StudentId == studentId)
                .OrderByDescending(g => g.ExamDate)
                .ToListAsync();
        }

        public async Task<GradeStatisticsDto> GetStudentStatisticsAsync(string studentId)
        {
            var grades = await _dbSet
                .Where(g => g.StudentId == studentId)
                .ToListAsync();

            if (!grades.Any())
            {
                return new GradeStatisticsDto
                {
                    TotalExams = 0,
                    AverageScore = 0,
                    AveragePercentage = 0,
                    HighestScore = 0,
                    LowestScore = 0
                };
            }

            var totalExams = grades.Count;
            var averageScore = Math.Round(grades.Average(g => g.Score), 2);
            
            var percentages = grades.Select(g => (g.Score / g.MaxScore) * 100).ToList();
            var averagePercentage = Math.Round(percentages.Average(), 2);
            
            var highestScore = grades.Max(g => g.Score);
            var lowestScore = grades.Min(g => g.Score);

            return new GradeStatisticsDto
            {
                TotalExams = totalExams,
                AverageScore = averageScore,
                AveragePercentage = averagePercentage,
                HighestScore = highestScore,
                LowestScore = lowestScore
            };
        }
    }
}
