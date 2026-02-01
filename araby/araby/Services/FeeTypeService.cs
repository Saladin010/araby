using araby.Data;
using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Services
{
    public class FeeTypeService : IFeeTypeService
    {
        private readonly IFeeTypeRepository _feeTypeRepository;
        private readonly ApplicationDbContext _context;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public FeeTypeService(IFeeTypeRepository feeTypeRepository, ApplicationDbContext context)
        {
            _feeTypeRepository = feeTypeRepository;
            _context = context;
        }

        public async Task<FeeTypeDto> CreateFeeTypeAsync(CreateFeeTypeDto dto, string createdById)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            var feeType = new FeeType
            {
                Name = dto.Name,
                Amount = dto.Amount,
                Frequency = dto.Frequency,
                CreatedAt = egyptNow,
                CreatedBy = createdById,
                IsActive = true
            };

            var createdFeeType = await _feeTypeRepository.AddAsync(feeType);

            // Auto-assign to groups if requested
            if (dto.AutoAssign && dto.SelectedGroupIds != null && dto.SelectedGroupIds.Any())
            {
                // Assign groups to fee type
                foreach (var groupId in dto.SelectedGroupIds)
                {
                    var feeTypeGroup = new FeeTypeGroup
                    {
                        FeeTypeId = createdFeeType.Id,
                        StudentGroupId = groupId
                    };
                    _context.FeeTypeGroups.Add(feeTypeGroup);
                }
                await _context.SaveChangesAsync();

                // Get all students from selected groups
                var studentIds = await _context.StudentGroupMembers
                    .Where(sgm => dto.SelectedGroupIds.Contains(sgm.StudentGroupId))
                    .Select(sgm => sgm.StudentId)
                    .Distinct()
                    .ToListAsync();

                // Create payment records for each student
                foreach (var studentId in studentIds)
                {
                    var payment = new StudentPayment
                    {
                        StudentId = studentId,
                        FeeTypeId = createdFeeType.Id,
                        ExpectedAmount = createdFeeType.Amount,
                        AmountPaid = 0,
                        PaymentDate = egyptNow,
                        PeriodStart = egyptNow,
                        PeriodEnd = egyptNow.AddMonths(1), // Default 1 month period
                        DueDate = egyptNow.AddDays(7), // Default 7 days due
                        GracePeriodDays = 30,
                        Status = PaymentStatus.Pending,
                        IsFullyPaid = false,
                        RecordedBy = createdById,
                        Notes = $"تم التعيين تلقائياً عند إنشاء {dto.Name}"
                    };
                    _context.StudentPayments.Add(payment);
                }
                await _context.SaveChangesAsync();
            }

            return await MapToFeeTypeDtoAsync(createdFeeType);
        }

        public async Task<IEnumerable<FeeTypeDto>> GetAllFeeTypesAsync()
        {
            var feeTypes = await _feeTypeRepository.GetAllAsync();
            var feeTypeDtos = new List<FeeTypeDto>();

            foreach (var feeType in feeTypes)
            {
                feeTypeDtos.Add(await MapToFeeTypeDtoAsync(feeType));
            }

            return feeTypeDtos;
        }

        public async Task<FeeTypeDto> GetFeeTypeByIdAsync(int feeTypeId)
        {
            var feeType = await _feeTypeRepository.GetByIdAsync(feeTypeId);
            if (feeType == null)
            {
                return null;
            }

            return await MapToFeeTypeDtoAsync(feeType);
        }

        public async Task<bool> UpdateFeeTypeAsync(int feeTypeId, UpdateFeeTypeDto dto)
        {
            var feeType = await _feeTypeRepository.GetByIdAsync(feeTypeId);
            if (feeType == null)
            {
                return false;
            }

            feeType.Name = dto.Name;
            feeType.Amount = dto.Amount;
            feeType.Frequency = dto.Frequency;

            await _feeTypeRepository.UpdateAsync(feeType);
            return true;
        }

        public async Task<bool> DeleteFeeTypeAsync(int feeTypeId)
        {
            var feeType = await _feeTypeRepository.GetByIdAsync(feeTypeId);
            if (feeType == null)
            {
                return false;
            }

            await _feeTypeRepository.DeleteAsync(feeType);
            return true;
        }

        public async Task<bool> AssignGroupsToFeeTypeAsync(int feeTypeId, List<int> groupIds, bool autoAssignToMembers)
        {
            var feeType = await _feeTypeRepository.GetByIdAsync(feeTypeId);
            if (feeType == null)
            {
                return false;
            }

            // Remove old FeeTypeGroup entries
            var existingEntries = await _context.FeeTypeGroups
                .Where(ftg => ftg.FeeTypeId == feeTypeId)
                .ToListAsync();

            _context.FeeTypeGroups.RemoveRange(existingEntries);

            // Add new FeeTypeGroup entries
            foreach (var groupId in groupIds)
            {
                var feeTypeGroup = new FeeTypeGroup
                {
                    FeeTypeId = feeTypeId,
                    StudentGroupId = groupId
                };

                _context.FeeTypeGroups.Add(feeTypeGroup);
            }

            await _context.SaveChangesAsync();

            // Auto-assign to members if requested
            if (autoAssignToMembers)
            {
                var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

                // Get all students from selected groups
                var studentIds = await _context.StudentGroupMembers
                    .Where(sgm => groupIds.Contains(sgm.StudentGroupId))
                    .Select(sgm => sgm.StudentId)
                    .Distinct()
                    .ToListAsync();

                // Get existing payments to avoid duplicates for the same period
                // Simplification based on business logic: checks if student already has ANY payment for this fee type
                // Can be refined to check for specific period if needed
                var existingPayments = await _context.StudentPayments
                    .Where(p => p.FeeTypeId == feeTypeId && studentIds.Contains(p.StudentId))
                    .Select(p => p.StudentId)
                    .ToListAsync();

                var newStudentIds = studentIds.Except(existingPayments).ToList();

                foreach (var studentId in newStudentIds)
                {
                    var payment = new StudentPayment
                    {
                        StudentId = studentId,
                        FeeTypeId = feeTypeId,
                        ExpectedAmount = feeType.Amount,
                        AmountPaid = 0,
                        PaymentDate = egyptNow,
                        PeriodStart = egyptNow,
                        PeriodEnd = egyptNow.AddMonths(1),
                        DueDate = egyptNow.AddDays(7),
                        GracePeriodDays = 30,
                        Status = PaymentStatus.Pending,
                        IsFullyPaid = false,
                        RecordedBy = feeType.CreatedBy, // Assign to fee type creator
                        Notes = $"تم التعيين تلقائياً عند تحديث مجموعات {feeType.Name}"
                    };
                    _context.StudentPayments.Add(payment);
                }
                
                await _context.SaveChangesAsync();
            }

            return true;
        }

        private async Task<FeeTypeDto> MapToFeeTypeDtoAsync(FeeType feeType)
        {
            var applicableGroupIds = await _context.FeeTypeGroups
                .Where(ftg => ftg.FeeTypeId == feeType.Id)
                .Select(ftg => ftg.StudentGroupId)
                .ToListAsync();

            return new FeeTypeDto
            {
                Id = feeType.Id,
                Name = feeType.Name,
                Amount = feeType.Amount,
                Frequency = feeType.Frequency,
                CreatedAt = feeType.CreatedAt,
                CreatedBy = feeType.CreatedBy,
                IsActive = feeType.IsActive,
                ApplicableGroupIds = applicableGroupIds
            };
        }
    }
}
