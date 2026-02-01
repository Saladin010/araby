using araby.Models;

namespace araby.DTOs
{
    // DTOs/FeeType/CreateFeeTypeDto.cs
    public class CreateFeeTypeDto
    {
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public PaymentFrequency Frequency { get; set; }
        public bool AutoAssign { get; set; }
        public List<int>? SelectedGroupIds { get; set; }
    }

    // DTOs/FeeType/FeeTypeDto.cs
    public class FeeTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public PaymentFrequency Frequency { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public bool IsActive { get; set; }
        public List<int> ApplicableGroupIds { get; set; }
    }

    // DTOs/FeeType/UpdateFeeTypeDto.cs
    public class UpdateFeeTypeDto
    {
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public PaymentFrequency Frequency { get; set; }
    }

    // DTOs/FeeType/AssignGroupsDto.cs
    public class AssignGroupsDto
    {
        public List<int> GroupIds { get; set; }
        public bool AutoAssignToMembers { get; set; }
    }
}
