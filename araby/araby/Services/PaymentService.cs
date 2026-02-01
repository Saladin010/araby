using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace araby.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IFeeTypeRepository _feeTypeRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public PaymentService(
            IPaymentRepository paymentRepository,
            IFeeTypeRepository feeTypeRepository,
            UserManager<ApplicationUser> userManager)
        {
            _paymentRepository = paymentRepository;
            _feeTypeRepository = feeTypeRepository;
            _userManager = userManager;
        }

        public async Task<PaymentDto> RecordPaymentAsync(CreatePaymentDto dto, string recordedById)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            var payment = new StudentPayment
            {
                StudentId = dto.StudentId,
                FeeTypeId = dto.FeeTypeId,
                AmountPaid = dto.AmountPaid,
                ExpectedAmount = dto.AmountPaid, // For direct payments, expected = paid
                PaymentDate = dto.PaymentDate,
                DueDate = dto.PaymentDate,       // Due date is payment date
                PeriodStart = dto.PeriodStart,
                PeriodEnd = dto.PeriodEnd,
                Status = PaymentStatus.Paid,
                IsFullyPaid = true,              // Mark as fully paid
                RecordedBy = recordedById,
                RecordedAt = egyptNow,
                Notes = dto.Notes
            };

            var createdPayment = await _paymentRepository.AddAsync(payment);
            
            // Load related entities for mapping
            var fullPayment = await _paymentRepository.GetByIdAsync(createdPayment.Id);
            return await MapToPaymentDtoAsync(fullPayment);
        }

        public async Task<IEnumerable<PaymentDto>> GetPaymentsByStudentIdAsync(string studentId)
        {
            var payments = await _paymentRepository.GetByStudentIdAsync(studentId);
            var paymentDtos = new List<PaymentDto>();

            foreach (var payment in payments)
            {
                paymentDtos.Add(await MapToPaymentDtoAsync(payment));
            }

            return paymentDtos;
        }

        public async Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync(
            string? studentId = null,
            int? feeTypeId = null,
            PaymentStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var payments = await _paymentRepository.GetAllAsync();
            
            // Apply filters
            var filteredPayments = payments.AsEnumerable();

            if (!string.IsNullOrEmpty(studentId))
            {
                filteredPayments = filteredPayments.Where(p => p.StudentId == studentId);
            }

            if (feeTypeId.HasValue)
            {
                filteredPayments = filteredPayments.Where(p => p.FeeTypeId == feeTypeId.Value);
            }

            if (status.HasValue)
            {
                filteredPayments = filteredPayments.Where(p => p.Status == status.Value);
            }

            if (startDate.HasValue)
            {
                filteredPayments = filteredPayments.Where(p => p.PaymentDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                filteredPayments = filteredPayments.Where(p => p.PaymentDate <= endDate.Value);
            }

            var paymentDtos = new List<PaymentDto>();

            foreach (var payment in filteredPayments)
            {
                paymentDtos.Add(await MapToPaymentDtoAsync(payment));
            }

            return paymentDtos;
        }

        public async Task<PaymentDto> GetPaymentByIdAsync(int paymentId)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentId);
            if (payment == null)
            {
                return null;
            }

            return await MapToPaymentDtoAsync(payment);
        }

        public async Task<bool> UpdatePaymentStatusAsync(int paymentId, PaymentStatus status)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentId);
            if (payment == null)
            {
                return false;
            }

            payment.Status = status;

            // If updating to Paid, ensure IsFullyPaid is true and Amount matches Expected
            if (status == PaymentStatus.Paid)
            {
                payment.IsFullyPaid = true;
                if (payment.AmountPaid < payment.ExpectedAmount)
                {
                    payment.AmountPaid = payment.ExpectedAmount;
                }
                payment.ActualPaymentDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            }
            // If updating to non-Paid (e.g. Pending), verification might be needed, 
            // but usually this flow is for confirming payment.
            // If reverting from Paid to Pending, we might need to handle that, but let's focus on the user issue (Confirm Payment).

            await _paymentRepository.UpdateAsync(payment);
            return true;
        }

        public async Task<IEnumerable<PaymentDto>> GetPendingPaymentsAsync()
        {
            var payments = await _paymentRepository.GetPendingPaymentsAsync();
            var paymentDtos = new List<PaymentDto>();

            foreach (var payment in payments)
            {
                paymentDtos.Add(await MapToPaymentDtoAsync(payment));
            }

            return paymentDtos;
        }

        public async Task<IEnumerable<PaymentDto>> GetOverduePaymentsAsync()
        {
            var payments = await _paymentRepository.GetOverduePaymentsAsync();
            var paymentDtos = new List<PaymentDto>();

            foreach (var payment in payments)
            {
                paymentDtos.Add(await MapToPaymentDtoAsync(payment));
            }

            return paymentDtos;
        }

        public async Task<PaymentStatisticsDto> GetPaymentStatisticsAsync()
        {
            return await _paymentRepository.GetPaymentStatisticsAsync();
        }

        // NEW METHODS for automatic payment system
        public async Task<IEnumerable<PaymentDto>> AssignFeeToStudentsAsync(AssignFeeDto dto, string assignedById)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            // Get students
            var students = dto.StudentIds == null || dto.StudentIds.Count == 0
                ? await _userManager.Users.Where(u => u.Role == UserRole.Student).ToListAsync()
                : await _userManager.Users.Where(u => dto.StudentIds.Contains(u.Id)).ToListAsync();

            var createdPayments = new List<StudentPayment>();

            foreach (var student in students)
            {
                var payment = new StudentPayment
                {
                    StudentId = student.Id,
                    FeeTypeId = dto.FeeTypeId,
                    ExpectedAmount = dto.Amount,
                    AmountPaid = 0,  // لم يدفع بعد
                    PaymentDate = egyptNow,  // تاريخ الإنشاء
                    DueDate = dto.DueDate,
                    PeriodStart = dto.PeriodStart,
                    PeriodEnd = dto.PeriodEnd,
                    GracePeriodDays = dto.GracePeriodDays,
                    IsFullyPaid = false,
                    Status = PaymentStatus.Pending,  // Initial status
                    RecordedBy = assignedById,
                    RecordedAt = egyptNow,
                    Notes = dto.Notes
                };

                var created = await _paymentRepository.AddAsync(payment);
                createdPayments.Add(created);
            }

            var paymentDtos = new List<PaymentDto>();
            foreach (var payment in createdPayments)
            {
                paymentDtos.Add(await MapToPaymentDtoAsync(payment));
            }

            return paymentDtos;
        }

        public async Task<PaymentDto> RecordPaymentAgainstFeeAsync(int paymentRecordId, decimal amountPaid, string recordedById)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentRecordId);

            if (payment == null)
                throw new Exception("Payment record not found");

            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            payment.AmountPaid += amountPaid;
            payment.ActualPaymentDate = egyptNow;
            payment.PaymentDate = egyptNow;

            // Check if fully paid
            if (payment.AmountPaid >= payment.ExpectedAmount)
            {
                payment.IsFullyPaid = true;
                payment.Status = PaymentStatus.Paid;
            }

            await _paymentRepository.UpdateAsync(payment);

            return await MapToPaymentDtoAsync(payment);
        }

        private async Task<PaymentDto> MapToPaymentDtoAsync(StudentPayment payment)
        {
            var student = await _userManager.FindByIdAsync(payment.StudentId);
            var feeType = await _feeTypeRepository.GetByIdAsync(payment.FeeTypeId);
            var recordedBy = await _userManager.FindByIdAsync(payment.RecordedBy);

            var today = DateTime.Now.Date;
            var daysUntilDue = (payment.DueDate.Date - today).Days;
            var overdueDate = payment.DueDate.AddDays(payment.GracePeriodDays);
            var daysOverdue = today > overdueDate ? (today - overdueDate).Days : 0;

            return new PaymentDto
            {
                Id = payment.Id,
                StudentId = payment.StudentId,
                StudentName = student?.FullName ?? "",
                FeeTypeId = payment.FeeTypeId,
                FeeTypeName = feeType?.Name ?? "",
                AmountPaid = payment.AmountPaid,
                PaymentDate = payment.PaymentDate,
                PeriodStart = payment.PeriodStart,
                PeriodEnd = payment.PeriodEnd,
                Status = payment.CalculatedStatus, // Use CalculatedStatus for real-time accuracy
                RecordedBy = payment.RecordedBy,
                RecordedByName = recordedBy?.FullName ?? "",
                RecordedAt = payment.RecordedAt,
                Notes = payment.Notes,
                // NEW FIELDS
                DueDate = payment.DueDate,
                ExpectedAmount = payment.ExpectedAmount,
                IsFullyPaid = payment.IsFullyPaid,
                ActualPaymentDate = payment.ActualPaymentDate,
                GracePeriodDays = payment.GracePeriodDays,
                CalculatedStatus = payment.CalculatedStatus,
                DaysUntilDue = daysUntilDue,
                DaysOverdue = daysOverdue
            };
        }
    }
}
