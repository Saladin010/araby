using araby.Data;
using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Services
{
    public class SessionService : ISessionService
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly ApplicationDbContext _context;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public SessionService(ISessionRepository sessionRepository, ApplicationDbContext context)
        {
            _sessionRepository = sessionRepository;
            _context = context;
        }

        public async Task<SessionDto> CreateSessionAsync(CreateSessionDto dto)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            var duration = dto.EndTime - dto.StartTime;

            var session = new Session
            {
                Title = dto.Title,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Duration = duration,
                Location = dto.Location,
                LocationUrl = dto.LocationUrl,
                Type = dto.Type,
                MaxStudents = dto.MaxStudents,
                IsRecurring = dto.IsRecurring,
                RecurringPattern = dto.RecurringPattern,
                CreatedAt = egyptNow
            };

            var createdSession = await _sessionRepository.AddAsync(session);
            return MapToSessionDto(createdSession);
        }

        public async Task<IEnumerable<SessionDto>> GetAllSessionsAsync()
        {
            var sessions = await _sessionRepository.GetAllAsync();
            var sessionDtos = new List<SessionDto>();

            foreach (var session in sessions)
            {
                sessionDtos.Add(await MapToSessionDtoWithCountAsync(session));
            }

            return sessionDtos;
        }

        public async Task<SessionDto> GetSessionByIdAsync(int sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);
            if (session == null)
            {
                return null;
            }

            return await MapToSessionDtoWithCountAsync(session);
        }

        public async Task<bool> UpdateSessionAsync(int sessionId, UpdateSessionDto dto)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);
            if (session == null)
            {
                return false;
            }

            var duration = dto.EndTime - dto.StartTime;

            session.Title = dto.Title;
            session.StartTime = dto.StartTime;
            session.EndTime = dto.EndTime;
            session.Duration = duration;
            session.Location = dto.Location;
            session.LocationUrl = dto.LocationUrl;
            session.Type = dto.Type;
            session.MaxStudents = dto.MaxStudents;
            session.IsRecurring = dto.IsRecurring;
            session.RecurringPattern = dto.RecurringPattern;

            await _sessionRepository.UpdateAsync(session);
            return true;
        }

        public async Task<bool> DeleteSessionAsync(int sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);
            if (session == null)
            {
                return false;
            }

            await _sessionRepository.DeleteAsync(session);
            return true;
        }

        public async Task<bool> AddStudentsToSessionAsync(int sessionId, List<string> studentIds)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);
            if (session == null)
            {
                return false;
            }

            // Check MaxStudents for group sessions
            if (session.Type == SessionType.Group && session.MaxStudents.HasValue)
            {
                var currentCount = await _context.SessionStudents
                    .CountAsync(ss => ss.SessionId == sessionId);

                if (currentCount + studentIds.Count > session.MaxStudents.Value)
                {
                    return false; // Exceeds max students
                }
            }

            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            foreach (var studentId in studentIds)
            {
                // Check if student is already enrolled
                var exists = await _context.SessionStudents
                    .AnyAsync(ss => ss.SessionId == sessionId && ss.StudentId == studentId);

                if (!exists)
                {
                    var sessionStudent = new SessionStudent
                    {
                        SessionId = sessionId,
                        StudentId = studentId,
                        EnrolledAt = egyptNow
                    };

                    _context.SessionStudents.Add(sessionStudent);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveStudentFromSessionAsync(int sessionId, string studentId)
        {
            var sessionStudent = await _context.SessionStudents
                .FirstOrDefaultAsync(ss => ss.SessionId == sessionId && ss.StudentId == studentId);

            if (sessionStudent == null)
            {
                return false;
            }

            _context.SessionStudents.Remove(sessionStudent);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<SessionDto>> GetUpcomingSessionsAsync()
        {
            var sessions = await _sessionRepository.GetUpcomingSessionsAsync();
            var sessionDtos = new List<SessionDto>();

            foreach (var session in sessions)
            {
                sessionDtos.Add(await MapToSessionDtoWithCountAsync(session));
            }

            return sessionDtos;
        }

        public async Task<IEnumerable<SessionDto>> GetSessionsByStudentIdAsync(string studentId)
        {
            var sessions = await _sessionRepository.GetSessionsByStudentIdAsync(studentId);
            var sessionDtos = new List<SessionDto>();

            foreach (var session in sessions)
            {
                sessionDtos.Add(await MapToSessionDtoWithCountAsync(session));
            }

            return sessionDtos;
        }

        private SessionDto MapToSessionDto(Session session)
        {
            return new SessionDto
            {
                Id = session.Id,
                Title = session.Title,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Duration = session.Duration,
                Location = session.Location,
                LocationUrl = session.LocationUrl,
                Type = session.Type,
                MaxStudents = session.MaxStudents,
                IsRecurring = session.IsRecurring,
                RecurringPattern = session.RecurringPattern,
                CreatedAt = session.CreatedAt,
                EnrolledStudentsCount = 0
            };
        }

        private async Task<SessionDto> MapToSessionDtoWithCountAsync(Session session)
        {
            var count = await _context.SessionStudents
                .CountAsync(ss => ss.SessionId == session.Id);

            return new SessionDto
            {
                Id = session.Id,
                Title = session.Title,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Duration = session.Duration,
                Location = session.Location,
                LocationUrl = session.LocationUrl,
                Type = session.Type,
                MaxStudents = session.MaxStudents,
                IsRecurring = session.IsRecurring,
                RecurringPattern = session.RecurringPattern,
                CreatedAt = session.CreatedAt,
                EnrolledStudentsCount = count
            };
        }
    }
}
