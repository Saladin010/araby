namespace araby.Models
{
   
    public class SessionStudent
    {
        public int SessionId { get; set; }
        public Session Session { get; set; }

        public string StudentId { get; set; }
        public ApplicationUser Student { get; set; }

        public DateTime EnrolledAt { get; set; }
    }
}
