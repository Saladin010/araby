using araby.Data;
using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Repositories
{
    public class AttendanceRepository : GenericRepository<Attendance>, IAttendanceRepository
    {
        public AttendanceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Attendance>> GetBySessionIdAsync(int sessionId)
        {
            return await _dbSet
                .Include(a => a.Student)
                .Include(a => a.Session)
                .Include(a => a.RecordedByUser)
                .Where(a => a.SessionId == sessionId)
                .OrderBy(a => a.Student.FullName)
                .ToListAsync();
        }

        public async Task<IEnumerable<Attendance>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet
                .Include(a => a.Session)
                .Include(a => a.RecordedByUser)
                .Where(a => a.StudentId == studentId)
                .OrderByDescending(a => a.Session.StartTime)
                .ToListAsync();
        }

        public async Task<AttendanceStatisticsDto> GetStudentStatisticsAsync(string studentId)
        {
            var attendances = await _dbSet
                .Where(a => a.StudentId == studentId)
                .ToListAsync();

            var totalSessions = attendances.Count;
            var presentCount = attendances.Count(a => a.Status == AttendanceStatus.Present);
            var absentCount = attendances.Count(a => a.Status == AttendanceStatus.Absent);
            var lateCount = attendances.Count(a => a.Status == AttendanceStatus.Late);
            var excusedCount = attendances.Count(a => a.Status == AttendanceStatus.Excused);

            var attendancePercentage = totalSessions > 0
                ? Math.Round((decimal)presentCount / totalSessions * 100, 2)
                : 0;

            return new AttendanceStatisticsDto
            {
                TotalSessions = totalSessions,
                PresentCount = presentCount,
                AbsentCount = absentCount,
                LateCount = lateCount,
                ExcusedCount = excusedCount,
                AttendancePercentage = attendancePercentage
            };
        }
    }
}
