using araby.Data;
using araby.Models;
using araby.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Repositories
{
    public class SessionRepository : GenericRepository<Session>, ISessionRepository
    {
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public SessionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Session>> GetUpcomingSessionsAsync()
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            return await _dbSet
                .Where(s => s.StartTime >= egyptNow)
                .OrderBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Session>> GetSessionsByStudentIdAsync(string studentId)
        {
            return await _dbSet
                .Include(s => s.SessionStudents)
                .Where(s => s.SessionStudents.Any(ss => ss.StudentId == studentId))
                .OrderByDescending(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<Session> GetSessionWithStudentsAsync(int sessionId)
        {
            return await _dbSet
                .Include(s => s.SessionStudents)
                    .ThenInclude(ss => ss.Student)
                .Include(s => s.Attendances)
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }
    }
}
