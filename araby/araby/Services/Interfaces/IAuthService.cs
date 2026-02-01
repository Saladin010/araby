using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        Task<CurrentUserDto> GetCurrentUserAsync(string userId);
        Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
    }
}
