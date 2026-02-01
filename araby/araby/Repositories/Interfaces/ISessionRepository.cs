using araby.Models;

namespace araby.Repositories.Interfaces
{
    public interface ISessionRepository : IGenericRepository<Session>
    {
        Task<IEnumerable<Session>> GetUpcomingSessionsAsync();
        Task<IEnumerable<Session>> GetSessionsByStudentIdAsync(string studentId);
        Task<Session> GetSessionWithStudentsAsync(int sessionId);
    }
}
