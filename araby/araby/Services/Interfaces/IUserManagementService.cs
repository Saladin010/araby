using araby.DTOs;
using araby.Models;

namespace araby.Services.Interfaces
{
    public interface IUserManagementService
    {
        Task<UserDto> CreateStudentAsync(CreateStudentDto dto, string createdById);
        Task<UserDto> CreateAssistantAsync(CreateAssistantDto dto, string createdById);
        Task<IEnumerable<UserDto>> GetAllStudentsAsync();
        Task<IEnumerable<UserDto>> GetAllAssistantsAsync();
        Task<UserDto> GetUserByIdAsync(string userId);
        Task<bool> UpdateUserAsync(string userId, UpdateUserDto dto);
        Task<bool> ChangeUserRoleAsync(string userId, UserRole newRole);
        Task<bool> ToggleUserActiveStatusAsync(string userId);
        Task<bool> DeleteUserAsync(string userId);
        Task<UserCredentialsDto> GetStudentCredentialsAsync(string studentId);
        Task<bool> ResetPasswordAsync(string userId, string newPassword);
    }
}
