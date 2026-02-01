using araby.Models;

namespace araby.DTOs
{
    // DTOs/Payment/CreatePaymentDto.cs
    public class CreatePaymentDto
    {
        public string StudentId { get; set; }
        public int FeeTypeId { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public string Notes { get; set; }
    }

    // DTOs/Payment/AssignFeeDto.cs - NEW
    public class AssignFeeDto
    {
        public int FeeTypeId { get; set; }
        public List<string>? StudentIds { get; set; }  // null = all students
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public int GracePeriodDays { get; set; } = 30;  // default
        public string? Notes { get; set; }
    }

    // DTOs/Payment/RecordPaymentDto.cs - NEW
    public class RecordPaymentDto
    {
        public decimal AmountPaid { get; set; }
    }

    // DTOs/Payment/PaymentDto.cs
    public class PaymentDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int FeeTypeId { get; set; }
        public string FeeTypeName { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public PaymentStatus Status { get; set; }
        public string RecordedBy { get; set; }
        public string RecordedByName { get; set; }
        public DateTime RecordedAt { get; set; }
        public string Notes { get; set; }

        // NEW FIELDS
        public DateTime DueDate { get; set; }
        public decimal ExpectedAmount { get; set; }
        public bool IsFullyPaid { get; set; }
        public DateTime? ActualPaymentDate { get; set; }
        public int GracePeriodDays { get; set; }
        public PaymentStatus CalculatedStatus { get; set; }
        public int DaysUntilDue { get; set; }  // Helper for UI
        public int DaysOverdue { get; set; }   // Helper for UI
    }

    // DTOs/Payment/UpdatePaymentStatusDto.cs
    public class UpdatePaymentStatusDto
    {
        public PaymentStatus Status { get; set; }
    }

    // DTOs/Payment/PaymentStatisticsDto.cs
    public class PaymentStatisticsDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int TotalPayments { get; set; }
        public int PendingPayments { get; set; }
        public int OverduePayments { get; set; }
        public decimal PendingAmount { get; set; }
        public decimal OverdueAmount { get; set; }
    }
}
