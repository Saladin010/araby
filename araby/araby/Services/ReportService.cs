using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace araby.Services
{
    public class ReportService : IReportService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly IGradeRepository _gradeRepository;
        private readonly ISessionRepository _sessionRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public ReportService(
            IPaymentRepository paymentRepository,
            IAttendanceRepository attendanceRepository,
            IGradeRepository gradeRepository,
            ISessionRepository sessionRepository,
            UserManager<ApplicationUser> userManager)
        {
            _paymentRepository = paymentRepository;
            _attendanceRepository = attendanceRepository;
            _gradeRepository = gradeRepository;
            _sessionRepository = sessionRepository;
            _userManager = userManager;
        }

        public async Task<MonthlyFinancialReportDto> GetMonthlyFinancialReportAsync(int year, int month)
        {
            // Get all payments
            var allPayments = await _paymentRepository.GetAllAsync();

            // Filter by year and month using Egypt timezone
            var monthlyPayments = allPayments.Where(p =>
            {
                var egyptDate = TimeZoneInfo.ConvertTimeFromUtc(p.PaymentDate.ToUniversalTime(), EgyptTimeZone);
                return egyptDate.Year == year && egyptDate.Month == month;
            }).ToList();

            var totalRevenue = monthlyPayments
                .Where(p => p.Status == PaymentStatus.Paid)
                .Sum(p => p.AmountPaid);

            var totalPayments = monthlyPayments.Count;
            var paidCount = monthlyPayments.Count(p => p.Status == PaymentStatus.Paid);
            var pendingCount = monthlyPayments.Count(p => p.Status == PaymentStatus.Pending);
            var overdueCount = monthlyPayments.Count(p => p.Status == PaymentStatus.Overdue);

            return new MonthlyFinancialReportDto
            {
                TotalRevenue = totalRevenue,
                TotalPayments = totalPayments,
                PaidCount = paidCount,
                PendingCount = pendingCount,
                OverdueCount = overdueCount,
                Month = month,
                Year = year
            };
        }

        public async Task<AttendanceSummaryReportDto> GetAttendanceSummaryReportAsync()
        {
            var allAttendances = await _attendanceRepository.GetAllAsync();
            var allSessions = await _sessionRepository.GetAllAsync();

            var totalSessions = allSessions.Count();
            var totalAttendanceRecords = allAttendances.Count();

            var presentCount = allAttendances.Count(a => a.Status == AttendanceStatus.Present);
            var absentCount = allAttendances.Count(a => a.Status == AttendanceStatus.Absent);
            var lateCount = allAttendances.Count(a => a.Status == AttendanceStatus.Late);
            var excusedCount = allAttendances.Count(a => a.Status == AttendanceStatus.Excused);

            var overallAttendancePercentage = totalAttendanceRecords > 0
                ? Math.Round((decimal)presentCount / totalAttendanceRecords * 100, 2)
                : 0;

            return new AttendanceSummaryReportDto
            {
                TotalSessions = totalSessions,
                TotalAttendanceRecords = totalAttendanceRecords,
                OverallAttendancePercentage = overallAttendancePercentage,
                PresentCount = presentCount,
                AbsentCount = absentCount,
                LateCount = lateCount,
                ExcusedCount = excusedCount
            };
        }

        public async Task<IEnumerable<StudentPerformanceReportDto>> GetStudentsPerformanceReportAsync()
        {
            // Get all students
            var students = await _userManager.Users
                .Where(u => u.Role == UserRole.Student)
                .ToListAsync();

            var performanceReports = new List<StudentPerformanceReportDto>();

            foreach (var student in students)
            {
                // Get attendance data
                var attendances = await _attendanceRepository.GetByStudentIdAsync(student.Id);
                var attendanceList = attendances.ToList();

                var totalSessions = attendanceList.Count;
                var presentCount = attendanceList.Count(a => a.Status == AttendanceStatus.Present);
                var attendancePercentage = totalSessions > 0
                    ? Math.Round((decimal)presentCount / totalSessions * 100, 2)
                    : 0;

                // Get grades data
                var grades = await _gradeRepository.GetByStudentIdAsync(student.Id);
                var gradesList = grades.ToList();

                var totalExams = gradesList.Count;
                var averageGrade = totalExams > 0
                    ? Math.Round(gradesList.Average(g => g.Score), 2)
                    : 0;

                var averagePercentage = totalExams > 0
                    ? Math.Round(gradesList.Average(g => (g.Score / g.MaxScore) * 100), 2)
                    : 0;

                performanceReports.Add(new StudentPerformanceReportDto
                {
                    StudentId = student.Id,
                    StudentName = student.FullName,
                    TotalSessions = totalSessions,
                    AttendancePercentage = attendancePercentage,
                    TotalExams = totalExams,
                    AverageGrade = averageGrade,
                    AveragePercentage = averagePercentage
                });
            }

            return performanceReports.OrderBy(p => p.StudentName);
        }

        public async Task<IEnumerable<PaymentDefaulterDto>> GetPaymentDefaultersAsync()
        {
            // Get all payments
            var allPayments = await _paymentRepository.GetAllAsync();

            // Group by student and filter those with overdue payments
            var studentPayments = allPayments
                .GroupBy(p => p.StudentId)
                .Where(g => g.Any(p => p.Status == PaymentStatus.Overdue))
                .ToList();

            var defaulters = new List<PaymentDefaulterDto>();

            foreach (var group in studentPayments)
            {
                var studentId = group.Key;
                var student = await _userManager.FindByIdAsync(studentId);

                if (student == null) continue;

                var overduePayments = group.Where(p => p.Status == PaymentStatus.Overdue).ToList();
                var totalOverdue = overduePayments.Count;
                var overdueAmount = overduePayments.Sum(p => p.AmountPaid);

                // Get last payment date (any status)
                var lastPayment = group
                    .OrderByDescending(p => p.PaymentDate)
                    .FirstOrDefault();

                defaulters.Add(new PaymentDefaulterDto
                {
                    StudentId = studentId,
                    StudentName = student.FullName,
                    TotalOverdue = totalOverdue,
                    OverdueAmount = overdueAmount,
                    LastPaymentDate = lastPayment?.PaymentDate
                });
            }

            return defaulters.OrderByDescending(d => d.OverdueAmount);
        }
    }
}
