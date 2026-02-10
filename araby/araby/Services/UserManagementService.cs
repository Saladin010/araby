using araby.DTOs;
using araby.Models;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace araby.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public UserManagementService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<UserDto> CreateStudentAsync(CreateStudentDto dto, string createdById)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            // Get next available StudentNumber
            var studentNumbers = await _userManager.Users
                .Where(u => u.StudentNumber.HasValue)
                .Select(u => u.StudentNumber.Value)
                .ToListAsync();
            
            var nextStudentNumber = studentNumbers.Any() ? studentNumbers.Max() + 1 : 1;

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                AcademicLevel = dto.AcademicLevel,
                Role = UserRole.Student,
                StudentNumber = nextStudentNumber, // Auto-assign sequential number
                IsActive = true,
                CreatedAt = egyptNow,
                CreatedBy = createdById,
                VisiblePassword = dto.Password // Store for display
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return null;
            }

            return MapToUserDto(user);
        }

        public async Task<UserDto> CreateAssistantAsync(CreateAssistantDto dto, string createdById)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Role = UserRole.Assistant,
                IsActive = true,
                CreatedAt = egyptNow,
                CreatedBy = createdById,
                VisiblePassword = dto.Password // Store for display
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return null;
            }

            return MapToUserDto(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllStudentsAsync()
        {
            var students = await _userManager.Users
                .Where(u => u.Role == UserRole.Student)
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return students.Select(MapToUserDto);
        }

        public async Task<IEnumerable<UserDto>> GetAllAssistantsAsync()
        {
            var assistants = await _userManager.Users
                .Where(u => u.Role == UserRole.Assistant)
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return assistants.Select(MapToUserDto);
        }

        public async Task<UserDto> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            return MapToUserDto(user);
        }

        public async Task<bool> UpdateUserAsync(string userId, UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            
            // Only update AcademicLevel if user is a student
            if (user.Role == UserRole.Student && !string.IsNullOrEmpty(dto.AcademicLevel))
            {
                user.AcademicLevel = dto.AcademicLevel;
            }

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> ChangeUserRoleAsync(string userId, UserRole newRole)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Validate role change
            if (user.Role == UserRole.Teacher)
            {
                // Cannot change teacher role
                return false;
            }

            user.Role = newRole;

            // Clear AcademicLevel if changing from Student to another role
            if (newRole != UserRole.Student)
            {
                user.AcademicLevel = null;
            }

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> ToggleUserActiveStatusAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Cannot deactivate teacher
            if (user.Role == UserRole.Teacher)
            {
                return false;
            }

            user.IsActive = !user.IsActive;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Cannot delete teacher
            if (user.Role == UserRole.Teacher)
            {
                return false;
            }

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<UserCredentialsDto> GetStudentCredentialsAsync(string studentId)
        {
            var user = await _userManager.FindByIdAsync(studentId);
            if (user == null)
            {
                return null;
            }

            return new UserCredentialsDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Password = user.VisiblePassword ?? "***", // Return stored password or mask if not available
                FullName = user.FullName
            };
        }

        public async Task<bool> ResetPasswordAsync(string userId, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (result.Succeeded)
            {
                user.VisiblePassword = newPassword;
                await _userManager.UpdateAsync(user);
            }

            return result.Succeeded;
        }

        private UserDto MapToUserDto(ApplicationUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                StudentNumber = user.StudentNumber,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                AcademicLevel = user.AcademicLevel,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                CreatedBy = user.CreatedBy
            };
        }
    }
}
