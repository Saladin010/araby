using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface IFeeTypeService
    {
        Task<FeeTypeDto> CreateFeeTypeAsync(CreateFeeTypeDto dto, string createdById);
        Task<IEnumerable<FeeTypeDto>> GetAllFeeTypesAsync();
        Task<FeeTypeDto> GetFeeTypeByIdAsync(int feeTypeId);
        Task<bool> UpdateFeeTypeAsync(int feeTypeId, UpdateFeeTypeDto dto);
        Task<bool> DeleteFeeTypeAsync(int feeTypeId);
        Task<bool> AssignGroupsToFeeTypeAsync(int feeTypeId, List<int> groupIds, bool autoAssignToMembers);
    }
}
