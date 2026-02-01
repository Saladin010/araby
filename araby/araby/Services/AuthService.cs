using araby.DTOs;
using araby.Models;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace araby.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager, 
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            try
            {
                _logger.LogInformation($"🔐 Login attempt for username: {loginDto.UserName}");
                
                // Find user by username
                var user = await _userManager.FindByNameAsync(loginDto.UserName);
                if (user == null)
                {
                    _logger.LogWarning($"❌ User not found: {loginDto.UserName}");
                    return null;
                }
                
                _logger.LogInformation($"✅ User found: {user.UserName} (ID: {user.Id})");

                // Check if user is active
                if (!user.IsActive)
                {
                    _logger.LogWarning($"❌ User is inactive: {loginDto.UserName}");
                    return null;
                }
                
                _logger.LogInformation($"✅ User is active");

                // Validate password
                var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
                if (!isPasswordValid)
                {
                    _logger.LogWarning($"❌ Invalid password for user: {loginDto.UserName}");
                    return null;
                }
                
                _logger.LogInformation($"✅ Password validated successfully");

                // Generate JWT token
                var token = GenerateJwtToken(user);
                
                _logger.LogInformation($"✅ JWT token generated for user: {user.UserName}");

                return new LoginResponseDto
                {
                    Token = token,
                    UserId = user.Id,
                    UserName = user.UserName,
                    FullName = user.FullName,
                    Role = user.Role
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Login error for user: {loginDto.UserName}");
                throw;
            }
        }

        public async Task<CurrentUserDto> GetCurrentUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            return new CurrentUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                AcademicLevel = user.AcademicLevel,
                IsActive = user.IsActive
            };
        }

        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning($"User not found: {userId}");
                    return false;
                }

                // Verify current password
                var isCurrentPasswordValid = await _userManager.CheckPasswordAsync(user, currentPassword);
                if (!isCurrentPasswordValid)
                {
                    _logger.LogWarning($"Invalid current password for user: {userId}");
                    return false;
                }

                // Change password
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

                if (result.Succeeded)
                {
                    // Update visible password
                    user.VisiblePassword = newPassword;
                    await _userManager.UpdateAsync(user);

                    _logger.LogInformation($"Password changed successfully for user: {userId}");
                    return true;
                }

                _logger.LogWarning($"Password change failed for user: {userId}");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error changing password for user: {userId}");
                return false;
            }
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("userId", user.Id),
                new Claim("username", user.UserName),
                new Claim("role", user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // 7 days expiration
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
