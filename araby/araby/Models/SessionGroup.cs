namespace araby.Models
{
    /// <summary>
    /// Represents the Many-to-Many relationship between Sessions and StudentGroups.
    /// Allows assigning entire groups to sessions instead of individual students.
    /// </summary>
    public class SessionGroup
    {
        public int SessionId { get; set; }
        public Session Session { get; set; }

        public int StudentGroupId { get; set; }
        public StudentGroup StudentGroup { get; set; }

        public DateTime EnrolledAt { get; set; }
    }
}
