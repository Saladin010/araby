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
                .Include(s => s.SessionStudents)
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

        public async Task<IEnumerable<Session>> GetTodayActiveSessionsAsync()
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            var today = egyptNow.Date; // 00:00 today
            var dayOfWeek = (int)egyptNow.DayOfWeek;

            // Get all sessions with necessary includes
            var allSessions = await _dbSet
                .Include(s => s.SessionStudents)
                .Include(s => s.SessionGroups)
                    .ThenInclude(sg => sg.StudentGroup)
                        .ThenInclude(g => g.Members)
                .ToListAsync();

            var todaySessions = new List<Session>();

            foreach (var session in allSessions)
            {
                if (!session.IsRecurring)
                {
                    // Regular session: check if StartTime is today
                    if (session.StartTime.Date == today)
                    {
                        todaySessions.Add(session);
                    }
                }
                else if (!string.IsNullOrEmpty(session.RecurringPattern))
                {
                    // Recurring session: check if today matches pattern
                    try
                    {
                        var pattern = System.Text.Json.JsonSerializer.Deserialize<RecurringPattern>(session.RecurringPattern);
                        
                        if (pattern?.DaysOfWeek != null && pattern.DaysOfWeek.Contains(dayOfWeek))
                        {
                            // Check if session has started
                            if (session.StartTime.Date <= today)
                            {
                                // Check end date
                                if (!pattern.EndDate.HasValue || today <= pattern.EndDate.Value.Date)
                                {
                                    todaySessions.Add(session);
                                }
                            }
                        }
                    }
                    catch (System.Text.Json.JsonException)
                    {
                        // Invalid pattern, skip
                        continue;
                    }
                }
            }

            return todaySessions.OrderBy(s => s.StartTime.TimeOfDay);
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
