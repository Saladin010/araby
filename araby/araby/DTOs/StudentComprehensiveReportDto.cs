using araby.Models;

namespace araby.DTOs
{
    public class StudentComprehensiveReportDto
    {
        public string StudentId { get; set; }
        public string FullName { get; set; }
        public string StudentNumber { get; set; }
        public string AcademicLevel { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime UnlockedAt { get; set; }

        // Attendance Stats
        public int TotalSessions { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public int ExcusedCount { get; set; }
        public decimal AttendancePercentage { get; set; }
        public List<AttendanceRecordDto> RecentAttendance { get; set; }
        public string StudentStatus { get; set; }

        // Grades Stats
        public int TotalExams { get; set; }
        public decimal AverageScore { get; set; }
        public decimal AveragePercentage { get; set; }
        public decimal HighestScore { get; set; }
        public decimal LowestScore { get; set; }
        public List<GradeRecordDto> RecentGrades { get; set; }

        // Financial Stats
        public decimal TotalPaid { get; set; }
        public decimal TotalDue { get; set; } // Needed? Maybe TotalFeesAssigned
        public int PendingPaymentsCount { get; set; }
        public List<PaymentRecordDto> PaymentHistory { get; set; }
    }

    public class AttendanceRecordDto
    {
        public string SessionTitle { get; set; }
        public DateTime Date { get; set; }
        public AttendanceStatus Status { get; set; }
    }

    public class GradeRecordDto
    {
        public string ExamName { get; set; }
        public DateTime Date { get; set; }
        public double Score { get; set; }
        public double MaxScore { get; set; }
        public double Percentage => MaxScore > 0 ? (Score / MaxScore) * 100 : 0;
    }

    public class PaymentRecordDto
    {
        public string FeeType { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public PaymentStatus Status { get; set; }
    }
}
