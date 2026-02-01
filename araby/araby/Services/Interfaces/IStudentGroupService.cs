using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface IStudentGroupService
    {
        Task<StudentGroupDto> CreateGroupAsync(CreateStudentGroupDto dto);
        Task<IEnumerable<StudentGroupDto>> GetAllGroupsAsync();
        Task<StudentGroupDetailsDto> GetGroupByIdAsync(int groupId);
        Task<bool> UpdateGroupAsync(int groupId, UpdateStudentGroupDto dto);
        Task<bool> DeleteGroupAsync(int groupId);
        Task<bool> AddStudentsToGroupAsync(int groupId, List<string> studentIds);
        Task<bool> RemoveStudentFromGroupAsync(int groupId, string studentId);
        Task<object> GetGroupStatisticsAsync(int groupId);
    }
}
