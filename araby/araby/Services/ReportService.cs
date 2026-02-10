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

        public async Task<StudentComprehensiveReportDto> GetStudentComprehensiveReportAsync(string studentId)
        {
            var student = await _userManager.FindByIdAsync(studentId);
            if (student == null) return null;

            // 1. Attendance Stats
            var attendances = await _attendanceRepository.GetByStudentIdAsync(studentId);
            var attList = attendances.ToList();
            var totalSessions = attList.Count;
            var presentCount = attList.Count(a => a.Status == AttendanceStatus.Present);
            var absentCount = attList.Count(a => a.Status == AttendanceStatus.Absent);
            var lateCount = attList.Count(a => a.Status == AttendanceStatus.Late);
            var excusedCount = attList.Count(a => a.Status == AttendanceStatus.Excused);
            var attPercentage = totalSessions > 0 ? (decimal)presentCount / totalSessions * 100 : 0;

            var recentAttendance = attList
                .OrderByDescending(a => a.SessionDate)
                .Take(5)
                .Select(a => new AttendanceRecordDto
                {
                    SessionTitle = a.Session?.Title ?? "Unknown Session",
                    Date = a.SessionDate,
                    Status = a.Status
                })
                .ToList();

            // Calculate Status Score
            // Default: 100
            // Late: -5
            // Absent: -10
            // Excused: -0
            // 2. Grade Stats
            var grades = await _gradeRepository.GetByStudentIdAsync(studentId);
            var gradeList = grades.ToList();
            var totalExams = gradeList.Count;
            var avgScore = totalExams > 0 ? (decimal)gradeList.Average(g => g.Score) : 0;
            var highestScore = totalExams > 0 ? (decimal)gradeList.Max(g => g.Score) : 0;
            var lowestScore = totalExams > 0 ? (decimal)gradeList.Min(g => g.Score) : 0;
            var avgPercentage = totalExams > 0 ? (decimal)gradeList.Average(g => (g.Score / g.MaxScore) * 100) : 0;

            var recentGrades = gradeList
                .OrderByDescending(g => g.ExamDate)
                .Take(5)
                .Select(g => new GradeRecordDto
                {
                    ExamName = g.ExamName,
                    Date = g.ExamDate,
                    Score = (double)g.Score,
                    MaxScore = (double)g.MaxScore
                })
                .ToList();

            // Calculate Status Score (Attendance + Grades)
            var absenceScore = 100 - (absentCount * 10) - (lateCount * 5);
            var statusDescription = "ممتاز";

            if (absenceScore < 50 || avgPercentage < 50)
                statusDescription = "خطر";
            else if (absenceScore < 70 || avgPercentage < 65)
                statusDescription = "تحتاج متابعة";
            else if (absenceScore < 90 || avgPercentage < 85)
                statusDescription = "جيد جداً";

            // 3. Payment Stats
            var payments = await _paymentRepository.GetByStudentIdAsync(studentId);
            var paymentList = payments.ToList();
            var totalPaid = paymentList.Where(p => p.Status == PaymentStatus.Paid).Sum(p => p.AmountPaid);
            var pendingCount = paymentList.Count(p => p.Status == PaymentStatus.Pending);
            
            var recentPayments = paymentList
                .OrderByDescending(p => p.PaymentDate)
                .Take(5)
                .Select(p => new PaymentRecordDto
                {
                    FeeType = p.FeeType?.Name ?? "General",
                    Amount = p.AmountPaid > 0 ? p.AmountPaid : p.ExpectedAmount,
                    Date = p.PaymentDate,
                    Status = p.Status
                })
                .ToList();

            return new StudentComprehensiveReportDto
            {
                StudentId = student.Id,
                FullName = student.FullName,
                StudentNumber = student.StudentNumber?.ToString(),
                AcademicLevel = student.AcademicLevel,
                PhoneNumber = student.PhoneNumber,
                UnlockedAt = student.CreatedAt,
                
                TotalSessions = totalSessions,
                PresentCount = presentCount,
                AbsentCount = absentCount,
                LateCount = lateCount,
                ExcusedCount = excusedCount,
                AttendancePercentage = Math.Round(attPercentage, 1),
                RecentAttendance = recentAttendance,
                StudentStatus = statusDescription, // New Field need to add to DTO

                TotalExams = totalExams,
                AverageScore = Math.Round(avgScore, 1),
                AveragePercentage = Math.Round(avgPercentage, 1),
                HighestScore = highestScore,
                LowestScore = lowestScore,
                RecentGrades = recentGrades,

                TotalPaid = totalPaid,
                PendingPaymentsCount = pendingCount,
                PaymentHistory = recentPayments
            };
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
