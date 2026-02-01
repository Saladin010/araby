using araby.DTOs;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace araby.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
            
            if (result == null)
            {
                return Unauthorized(new { message = "Invalid credentials or inactive account" });
            }

            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // JWT is stateless, logout is handled client-side by removing the token
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("current-user")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst("userId")?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var user = await _authService.GetCurrentUserAsync(userId);
            
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var result = await _authService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);

            if (!result)
            {
                return BadRequest(new { message = "Current password is incorrect or password change failed" });
            }

            return Ok(new { message = "Password changed successfully" });
        }
    }
}
