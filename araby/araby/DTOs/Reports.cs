namespace araby.DTOs
{
    // DTOs/Reports/MonthlyFinancialReportDto.cs
    public class MonthlyFinancialReportDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalPayments { get; set; }
        public int PaidCount { get; set; }
        public int PendingCount { get; set; }
        public int OverdueCount { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }

    // DTOs/Reports/AttendanceSummaryReportDto.cs
    public class AttendanceSummaryReportDto
    {
        public int TotalSessions { get; set; }
        public int TotalAttendanceRecords { get; set; }
        public decimal OverallAttendancePercentage { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public int ExcusedCount { get; set; }
    }

    // DTOs/Reports/StudentPerformanceReportDto.cs
    public class StudentPerformanceReportDto
    {
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int TotalSessions { get; set; }
        public decimal AttendancePercentage { get; set; }
        public int TotalExams { get; set; }
        public decimal AverageGrade { get; set; }
        public decimal AveragePercentage { get; set; }
    }

    // DTOs/Reports/PaymentDefaulterDto.cs
    public class PaymentDefaulterDto
    {
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int TotalOverdue { get; set; }
        public decimal OverdueAmount { get; set; }
        public DateTime? LastPaymentDate { get; set; }
    }
}
