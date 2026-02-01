using araby.Models;

namespace araby.DTOs
{
    // DTOs/Session/CreateSessionDto.cs
    public class CreateSessionDto
    {
        public string Title { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public string LocationUrl { get; set; }
        public SessionType Type { get; set; }
        public int? MaxStudents { get; set; }
        public bool IsRecurring { get; set; }
        public string RecurringPattern { get; set; }
    }

    // DTOs/Session/SessionDto.cs
    public class SessionDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public TimeSpan Duration { get; set; }
        public string Location { get; set; }
        public string LocationUrl { get; set; }
        public SessionType Type { get; set; }
        public int? MaxStudents { get; set; }
        public bool IsRecurring { get; set; }
        public string RecurringPattern { get; set; }
        public DateTime CreatedAt { get; set; }
        public int EnrolledStudentsCount { get; set; }
    }

    // DTOs/Session/UpdateSessionDto.cs
    public class UpdateSessionDto
    {
        public string Title { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public string LocationUrl { get; set; }
        public SessionType Type { get; set; }
        public int? MaxStudents { get; set; }
        public bool IsRecurring { get; set; }
        public string RecurringPattern { get; set; }
    }

    // DTOs/Session/AddStudentsToSessionDto.cs
    public class AddStudentsToSessionDto
    {
        public List<string> StudentIds { get; set; }
    }
}
