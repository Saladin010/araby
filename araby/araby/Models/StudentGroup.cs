namespace araby.Models
{

    public class StudentGroup
    {
        public int Id { get; set; }
        public string GroupName { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public ICollection<StudentGroupMember> Members { get; set; }
        public ICollection<FeeTypeGroup> ApplicableFees { get; set; }
        public ICollection<SessionGroup> AssignedSessions { get; set; } // Sessions this group is enrolled in
    }
}
