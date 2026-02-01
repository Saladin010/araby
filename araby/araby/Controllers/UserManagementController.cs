using araby.DTOs;
using araby.Models;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace araby.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;

        public UserManagementController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        [HttpPost("student")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst("userId")?.Value;
            var user = await _userManagementService.CreateStudentAsync(dto, userId);

            if (user == null)
            {
                return BadRequest(new { message = "Failed to create student" });
            }

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPost("assistant")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> CreateAssistant([FromBody] CreateAssistantDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst("userId")?.Value;
            var user = await _userManagementService.CreateAssistantAsync(dto, userId);

            if (user == null)
            {
                return BadRequest(new { message = "Failed to create assistant" });
            }

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpGet("students")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _userManagementService.GetAllStudentsAsync();
            return Ok(students);
        }

        [HttpGet("assistants")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetAllAssistants()
        {
            var assistants = await _userManagementService.GetAllAssistantsAsync();
            return Ok(assistants);
        }

        // IMPORTANT: More specific routes must come BEFORE generic {id} route
        [HttpGet("{id}/credentials")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetUserCredentials(string id)
        {
            var credentials = await _userManagementService.GetStudentCredentialsAsync(id);

            if (credentials == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(credentials);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManagementService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userManagementService.UpdateUserAsync(id, dto);

            if (!result)
            {
                return NotFound(new { message = "User not found or update failed" });
            }

            return Ok(new { message = "User updated successfully" });
        }

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> ChangeUserRole(string id, [FromBody] ChangeRoleDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userManagementService.ChangeUserRoleAsync(id, dto.NewRole);

            if (!result)
            {
                return BadRequest(new { message = "Failed to change role. User not found or role change not allowed" });
            }

            return Ok(new { message = "Role changed successfully" });
        }

        [HttpPut("{id}/toggle-active")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> ToggleUserActiveStatus(string id)
        {
            var result = await _userManagementService.ToggleUserActiveStatusAsync(id);

            if (!result)
            {
                return BadRequest(new { message = "Failed to toggle active status. User not found or action not allowed" });
            }

            return Ok(new { message = "Active status toggled successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _userManagementService.DeleteUserAsync(id);

            if (!result)
            {
                return BadRequest(new { message = "Failed to delete user. User not found or deletion not allowed" });
            }

            return Ok(new { message = "User deleted successfully" });
        }



        [HttpPost("{id}/reset-password")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> ResetPassword(string id, [FromBody] ResetPasswordDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userManagementService.ResetPasswordAsync(id, dto.NewPassword);

            if (!result)
            {
                return BadRequest(new { message = "Failed to reset password. User not found or invalid password" });
            }

            return Ok(new { message = "Password reset successfully" });
        }
    }
}
