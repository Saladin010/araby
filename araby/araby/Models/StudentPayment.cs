namespace araby.Models
{
  
    public class StudentPayment
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public ApplicationUser Student { get; set; }

        public int FeeTypeId { get; set; }
        public FeeType FeeType { get; set; }

        public decimal AmountPaid { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime PeriodStart { get; set; } // بداية الفترة (مثلاً شهر يناير)
        public DateTime PeriodEnd { get; set; } // نهاية الفترة
        public PaymentStatus Status { get; set; }

        public string RecordedBy { get; set; } // Teacher or Assistant UserId
        public ApplicationUser RecordedByUser { get; set; }
        public DateTime RecordedAt { get; set; }
        public string? Notes { get; set; }

        // NEW FIELDS for automatic payment system
        public DateTime DueDate { get; set; }              // تاريخ الاستحقاق
        public decimal ExpectedAmount { get; set; }         // المبلغ المطلوب
        public bool IsFullyPaid { get; set; }              // هل مدفوع بالكامل؟
        public DateTime? ActualPaymentDate { get; set; }   // تاريخ الدفع الفعلي
        public int GracePeriodDays { get; set; }           // فترة السماح (default: 30)

        // Computed property for automatic status calculation
        public PaymentStatus CalculatedStatus
        {
            get
            {
                if (IsFullyPaid && AmountPaid >= ExpectedAmount)
                    return PaymentStatus.Paid;

                var today = DateTime.Now.Date;
                var overdueDate = DueDate.AddDays(GracePeriodDays);

                if (today > overdueDate)
                    return PaymentStatus.Overdue;  // متأخر

                return PaymentStatus.Pending;      // معلق
            }
        }
    }
}
