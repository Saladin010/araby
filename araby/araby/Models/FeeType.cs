namespace araby.Models
{
  
    public class FeeType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public PaymentFrequency Frequency { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } // Teacher UserId
        public bool IsActive { get; set; }

        // Navigation Properties
        public ICollection<FeeTypeGroup> ApplicableGroups { get; set; } // Many-to-Many مع المجموعات
        public ICollection<StudentPayment> Payments { get; set; }
    }
}
