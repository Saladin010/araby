namespace araby.Models
{
 
    public class Attendance
    {
        public int Id { get; set; }
        public int SessionId { get; set; }
        public Session Session { get; set; }

        public string StudentId { get; set; }
        public ApplicationUser Student { get; set; }

        /// &lt;summary&gt;
        /// Date of the session occurrence (date only, no time).
        /// For recurring sessions, this represents which day this attendance is for.
        /// &lt;/summary&gt;
        public DateTime SessionDate { get; set; }

        public AttendanceStatus Status { get; set; }
        public DateTime RecordedAt { get; set; }
        public string RecordedBy { get; set; } // UserId (Teacher or Assistant)
        public ApplicationUser RecordedByUser { get; set; }
        public string? Notes { get; set; }
    }
}
