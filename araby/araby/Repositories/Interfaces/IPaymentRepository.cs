using araby.DTOs;
using araby.Models;

namespace araby.Repositories.Interfaces
{
    public interface IPaymentRepository : IGenericRepository<StudentPayment>
    {
        Task<IEnumerable<StudentPayment>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<StudentPayment>> GetPendingPaymentsAsync();
        Task<IEnumerable<StudentPayment>> GetOverduePaymentsAsync();
        Task<PaymentStatisticsDto> GetPaymentStatisticsAsync();
    }
}
