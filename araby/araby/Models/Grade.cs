namespace araby.Models
{
    
    public class Grade
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public ApplicationUser Student { get; set; }

        public string ExamName { get; set; }
        public decimal Score { get; set; }
        public decimal MaxScore { get; set; }
        public DateTime ExamDate { get; set; }
        public string? Notes { get; set; }

        public string RecordedBy { get; set; }
        public ApplicationUser RecordedByUser { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}
