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

            // Convert incoming UTC times to Egypt timezone
            var startTimeEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.StartTime.ToUniversalTime(), EgyptTimeZone);
            var endTimeEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.EndTime.ToUniversalTime(), EgyptTimeZone);
            var duration = endTimeEgypt - startTimeEgypt;

            var session = new Session
            {
                Title = dto.Title,
                StartTime = startTimeEgypt,
                EndTime = endTimeEgypt,
                Duration = duration,
                Location = dto.Location,
                LocationUrl = dto.LocationUrl,
                Type = dto.Type,
                MaxStudents = dto.MaxStudents,
                AcademicLevel = dto.AcademicLevel,
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

            // Convert incoming UTC times to Egypt timezone
            var startTimeEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.StartTime.ToUniversalTime(), EgyptTimeZone);
            var endTimeEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.EndTime.ToUniversalTime(), EgyptTimeZone);
            var duration = endTimeEgypt - startTimeEgypt;

            session.Title = dto.Title;
            session.StartTime = startTimeEgypt;
            session.EndTime = endTimeEgypt;
            session.Duration = duration;
            session.Location = dto.Location;
            session.LocationUrl = dto.LocationUrl;
            session.Type = dto.Type;
            session.MaxStudents = dto.MaxStudents;
            session.AcademicLevel = dto.AcademicLevel;
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

        public async Task<bool> AddGroupToSessionAsync(int sessionId, int groupId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);
            if (session == null) return false;

            // Check if group exists
            var groupExists = await _context.StudentGroups.AnyAsync(g => g.Id == groupId);
            if (!groupExists) return false;

            // Check if already assigned
            var exists = await _context.SessionGroups
                .AnyAsync(sg => sg.SessionId == sessionId && sg.StudentGroupId == groupId);

            if (exists) return true;

            // Check MaxStudents
            if (session.Type == SessionType.Group && session.MaxStudents.HasValue)
            {
                // Get all current distinct students
                var individualIds = await _context.SessionStudents
                    .Where(ss => ss.SessionId == sessionId)
                    .Select(ss => ss.StudentId)
                    .ToListAsync();

                var currentGroupIds = await _context.SessionGroups
                    .Where(sg => sg.SessionId == sessionId)
                    .SelectMany(sg => sg.StudentGroup.Members)
                    .Select(m => m.StudentId)
                    .ToListAsync();
                
                var newGroupIds = await _context.StudentGroupMembers
                    .Where(m => m.StudentGroupId == groupId)
                    .Select(m => m.StudentId)
                    .ToListAsync();

                // Union all to get distinct count if we add this group
                var totalStudents = individualIds
                    .Concat(currentGroupIds)
                    .Concat(newGroupIds)
                    .Distinct()
                    .Count();

                if (totalStudents > session.MaxStudents.Value)
                {
                    return false;
                }
            }

            var sessionGroup = new SessionGroup
            {
                SessionId = sessionId,
                StudentGroupId = groupId,
                EnrolledAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone)
            };

            _context.SessionGroups.Add(sessionGroup);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveGroupFromSessionAsync(int sessionId, int groupId)
        {
            var sessionGroup = await _context.SessionGroups
                .FirstOrDefaultAsync(sg => sg.SessionId == sessionId && sg.StudentGroupId == groupId);

            if (sessionGroup == null) return false;

            _context.SessionGroups.Remove(sessionGroup);
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

        public async Task<IEnumerable<SessionDto>> GetTodayActiveSessionsAsync()
        {
            var sessions = await _sessionRepository.GetTodayActiveSessionsAsync();
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
                AcademicLevel = session.AcademicLevel,
                IsRecurring = session.IsRecurring,
                RecurringPattern = session.RecurringPattern,
                CreatedAt = session.CreatedAt,
                EnrolledStudentsCount = 0
            };
        }

        private async Task<SessionDto> MapToSessionDtoWithCountAsync(Session session)
        {
            // ✅ Get individual students with details
            var individualStudents = await _context.SessionStudents
                .Where(ss => ss.SessionId == session.Id)
                .Include(ss => ss.Student)
                .Select(ss => new EnrolledStudentDto
                {
                    Id = ss.Student.Id,
                    FullName = ss.Student.FullName,
                    Email = ss.Student.Email,
                    PhoneNumber = ss.Student.PhoneNumber,
                    AcademicLevel = ss.Student.AcademicLevel,
                    EnrollmentSource = "Individual"
                })
                .ToListAsync();

            // ✅ Get group students with details
            var groupStudents = await _context.SessionGroups
                .Where(sg => sg.SessionId == session.Id)
                .SelectMany(sg => sg.StudentGroup.Members.Select(m => new 
                { 
                    Member = m, 
GroupName = sg.StudentGroup.GroupName 
                }))
                .Select(x => new EnrolledStudentDto
                {
                    Id = x.Member.Student.Id,
                    FullName = x.Member.Student.FullName,
                    Email = x.Member.Student.Email,
                    PhoneNumber = x.Member.Student.PhoneNumber,
                    AcademicLevel = x.Member.Student.AcademicLevel,
                    EnrollmentSource = x.GroupName
                })
                .ToListAsync();

            // ✅ Merge and remove duplicates
            var allEnrolledStudents = individualStudents
                .Concat(groupStudents)
                .GroupBy(s => s.Id)
                .Select(g => g.First())
                .ToList();

            var count = allEnrolledStudents.Count;

            var assignedGroups = await _context.SessionGroups
                .Where(sg => sg.SessionId == session.Id)
                .Select(sg => new StudentGroupDto
                {
                    Id = sg.StudentGroup.Id,
                    GroupName = sg.StudentGroup.GroupName,
                    Description = sg.StudentGroup.Description,
                    CreatedAt = sg.StudentGroup.CreatedAt,
                    MembersCount = sg.StudentGroup.Members.Count
                })
                .ToListAsync();

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
                AcademicLevel = session.AcademicLevel,
                IsRecurring = session.IsRecurring,
                RecurringPattern = session.RecurringPattern,
                CreatedAt = session.CreatedAt,
                EnrolledStudentsCount = count,
                AssignedGroups = assignedGroups,
                EnrolledStudents = allEnrolledStudents  // ✅ Add enrolled students list
            };
        }
    }
}
