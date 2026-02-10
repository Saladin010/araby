using araby.Models;

namespace araby.DTOs
{
    // DTOs/Attendance/CreateAttendanceDto.cs
    public class CreateAttendanceDto
    {
        public int SessionId { get; set; }
        public string StudentId { get; set; }
        public DateTime? SessionDate { get; set; } // Optional, defaults to Today if null
        public AttendanceStatus Status { get; set; }
        public string Notes { get; set; }
    }

    // DTOs/Attendance/AttendanceDto.cs
    public class AttendanceDto
    {
        public int Id { get; set; }
        public int SessionId { get; set; }
        public string SessionTitle { get; set; }
        public string StudentId { get; set; }
        public string StudentNumber { get; set; }
        public string StudentName { get; set; }
        public DateTime SessionDate { get; set; } // The date of the session occurrence
        public AttendanceStatus Status { get; set; }
        public DateTime RecordedAt { get; set; }
        public string RecordedBy { get; set; }
        public string RecordedByName { get; set; }
        public string Notes { get; set; }
    }

    // DTOs/Attendance/UpdateAttendanceDto.cs
    public class UpdateAttendanceDto
    {
        public AttendanceStatus Status { get; set; }
        public string Notes { get; set; }
    }

    // DTOs/Attendance/AttendanceStatisticsDto.cs
    public class AttendanceStatisticsDto
    {
        public int TotalSessions { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public int ExcusedCount { get; set; }
        public decimal AttendancePercentage { get; set; }
    }
}
