using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface ISessionService
    {
        Task<SessionDto> CreateSessionAsync(CreateSessionDto dto);
        Task<IEnumerable<SessionDto>> GetAllSessionsAsync();
        Task<SessionDto> GetSessionByIdAsync(int sessionId);
        Task<bool> UpdateSessionAsync(int sessionId, UpdateSessionDto dto);
        Task<bool> DeleteSessionAsync(int sessionId);
        Task<bool> AddStudentsToSessionAsync(int sessionId, List<string> studentIds);
        Task<bool> RemoveStudentFromSessionAsync(int sessionId, string studentId);
        Task<IEnumerable<SessionDto>> GetUpcomingSessionsAsync();
        Task<IEnumerable<SessionDto>> GetSessionsByStudentIdAsync(string studentId);
    }
}
