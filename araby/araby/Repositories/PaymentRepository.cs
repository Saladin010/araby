using araby.Data;
using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Repositories
{
    public class PaymentRepository : GenericRepository<StudentPayment>, IPaymentRepository
    {
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public PaymentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<StudentPayment>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet
                .Include(p => p.Student)
                .Include(p => p.FeeType)
                .Include(p => p.RecordedByUser)
                .Where(p => p.StudentId == studentId)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<StudentPayment>> GetPendingPaymentsAsync()
        {
            var today = DateTime.Now.Date;
            
            return await _dbSet
                .Include(p => p.Student)
                .Include(p => p.FeeType)
                .Include(p => p.RecordedByUser)
                .Where(p => !p.IsFullyPaid && 
                            today <= p.DueDate.AddDays(p.GracePeriodDays))
                .OrderBy(p => p.DueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<StudentPayment>> GetOverduePaymentsAsync()
        {
            var today = DateTime.Now.Date;
            
            return await _dbSet
                .Include(p => p.Student)
                .Include(p => p.FeeType)
                .Include(p => p.RecordedByUser)
                .Where(p => !p.IsFullyPaid && 
                            today > p.DueDate.AddDays(p.GracePeriodDays))
                .OrderBy(p => p.DueDate)
                .ToListAsync();
        }

        public async Task<PaymentStatisticsDto> GetPaymentStatisticsAsync()
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            var currentMonthStart = new DateTime(egyptNow.Year, egyptNow.Month, 1);
            var nextMonthStart = currentMonthStart.AddMonths(1);

            // Fetch all payments to memory to use calculated properties
            // Note: In a large production app, this should be optimized to database queries
            var allPayments = await _dbSet.ToListAsync();

            var totalRevenue = allPayments
                .Where(p => p.IsFullyPaid || p.AmountPaid > 0)
                .Sum(p => p.AmountPaid);

            var monthlyRevenue = allPayments
                .Where(p => (p.IsFullyPaid || p.AmountPaid > 0) &&
                           p.PaymentDate >= currentMonthStart && 
                           p.PaymentDate < nextMonthStart)
                .Sum(p => p.AmountPaid);

            var totalPayments = allPayments.Count;

            var pendingPayments = allPayments.Count(p => p.CalculatedStatus == PaymentStatus.Pending);
            var overduePayments = allPayments.Count(p => p.CalculatedStatus == PaymentStatus.Overdue);

            var pendingAmount = allPayments
                .Where(p => p.CalculatedStatus == PaymentStatus.Pending)
                .Sum(p => p.ExpectedAmount - p.AmountPaid);

            var overdueAmount = allPayments
                .Where(p => p.CalculatedStatus == PaymentStatus.Overdue)
                .Sum(p => p.ExpectedAmount - p.AmountPaid);

            return new PaymentStatisticsDto
            {
                TotalRevenue = totalRevenue,
                MonthlyRevenue = monthlyRevenue,
                TotalPayments = totalPayments,
                PendingPayments = pendingPayments,
                OverduePayments = overduePayments,
                PendingAmount = pendingAmount,
                OverdueAmount = overdueAmount
            };
        }
    }
}
