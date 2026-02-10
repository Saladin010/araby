namespace araby.Models
{
  
    public class Session
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public TimeSpan Duration { get; set; }
        public string Location { get; set; }
        public string? LocationUrl { get; set; } // لو أونلاين
        public SessionType Type { get; set; }
        public string? AcademicLevel { get; set; } // المستوى الدراسي للحصة (ثانوية عامة، الصف الأول، الخ)
        public int? MaxStudents { get; set; } // للمجموعات
        public bool IsRecurring { get; set; }
        public string? RecurringPattern { get; set; } // مثلاً كل أسبوع يوم كذا
        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public ICollection<Attendance> Attendances { get; set; }
        public ICollection<SessionStudent> SessionStudents { get; set; } // Many-to-Many (Individual students)
        public ICollection<SessionGroup> SessionGroups { get; set; } // Many-to-Many (Groups)
    }

}
