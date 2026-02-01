namespace araby.DTOs
{
    // DTOs/Grade/CreateGradeDto.cs
    public class CreateGradeDto
    {
        public string StudentId { get; set; }
        public string ExamName { get; set; }
        public decimal Score { get; set; }
        public decimal MaxScore { get; set; }
        public DateTime ExamDate { get; set; }
        public string Notes { get; set; }
    }

    // DTOs/Grade/GradeDto.cs
    public class GradeDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public string ExamName { get; set; }
        public decimal Score { get; set; }
        public decimal MaxScore { get; set; }
        public decimal Percentage { get; set; }
        public DateTime ExamDate { get; set; }
        public string Notes { get; set; }
        public string RecordedBy { get; set; }
        public string RecordedByName { get; set; }
        public DateTime RecordedAt { get; set; }
    }

    // DTOs/Grade/UpdateGradeDto.cs
    public class UpdateGradeDto
    {
        public string ExamName { get; set; }
        public decimal Score { get; set; }
        public decimal MaxScore { get; set; }
        public DateTime ExamDate { get; set; }
        public string Notes { get; set; }
    }

    // DTOs/Grade/GradeStatisticsDto.cs
    public class GradeStatisticsDto
    {
        public int TotalExams { get; set; }
        public decimal AverageScore { get; set; }
        public decimal AveragePercentage { get; set; }
        public decimal HighestScore { get; set; }
        public decimal LowestScore { get; set; }
    }
}
