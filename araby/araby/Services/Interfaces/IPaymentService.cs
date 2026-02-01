using araby.DTOs;
using araby.Models;

namespace araby.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentDto> RecordPaymentAsync(CreatePaymentDto dto, string recordedById);
        Task<IEnumerable<PaymentDto>> GetPaymentsByStudentIdAsync(string studentId);
        Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync(
            string? studentId = null,
            int? feeTypeId = null,
            PaymentStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null);
        Task<PaymentDto> GetPaymentByIdAsync(int paymentId);
        Task<bool> UpdatePaymentStatusAsync(int paymentId, PaymentStatus status);
        Task<IEnumerable<PaymentDto>> GetPendingPaymentsAsync();
        Task<IEnumerable<PaymentDto>> GetOverduePaymentsAsync();
        Task<PaymentStatisticsDto> GetPaymentStatisticsAsync();
        
        // NEW METHODS for automatic payment system
        Task<IEnumerable<PaymentDto>> AssignFeeToStudentsAsync(AssignFeeDto dto, string assignedById);
        Task<PaymentDto> RecordPaymentAgainstFeeAsync(int paymentRecordId, decimal amountPaid, string recordedById);
    }
}
