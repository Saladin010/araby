using araby.DTOs;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace araby.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;

        public SessionsController(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> CreateSession([FromBody] CreateSessionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var session = await _sessionService.CreateSessionAsync(dto);

            if (session == null)
            {
                return BadRequest(new { message = "Failed to create session" });
            }

            return CreatedAtAction(nameof(GetSession), new { id = session.Id }, session);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSessions()
        {
            var sessions = await _sessionService.GetAllSessionsAsync();
            return Ok(sessions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSession(int id)
        {
            var session = await _sessionService.GetSessionByIdAsync(id);

            if (session == null)
            {
                return NotFound(new { message = "Session not found" });
            }

            return Ok(session);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] UpdateSessionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _sessionService.UpdateSessionAsync(id, dto);

            if (!result)
            {
                return NotFound(new { message = "Session not found or update failed" });
            }

            return Ok(new { message = "Session updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var result = await _sessionService.DeleteSessionAsync(id);

            if (!result)
            {
                return NotFound(new { message = "Session not found" });
            }

            return NoContent();
        }

        [HttpPost("{id}/students")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> AddStudentsToSession(int id, [FromBody] List<string> studentIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _sessionService.AddStudentsToSessionAsync(id, studentIds);

            if (!result)
            {
                return BadRequest(new { message = "Failed to add students. Session not found or max capacity reached" });
            }

            return Ok(new { message = "Students added successfully" });
        }

        [HttpDelete("{sessionId}/students/{studentId}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> RemoveStudentFromSession(int sessionId, string studentId)
        {
            var result = await _sessionService.RemoveStudentFromSessionAsync(sessionId, studentId);

            if (!result)
            {
                return NotFound(new { message = "Session or student enrollment not found" });
            }

            return NoContent();
        }

        [HttpPost("{id}/groups/{groupId}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> AddGroupToSession(int id, int groupId)
        {
            var result = await _sessionService.AddGroupToSessionAsync(id, groupId);

            if (!result)
            {
                return BadRequest(new { message = "Failed to add group. Session/Group not found or max capacity reached" });
            }

            return Ok(new { message = "Group added successfully" });
        }

        [HttpDelete("{sessionId}/groups/{groupId}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> RemoveGroupFromSession(int sessionId, int groupId)
        {
            var result = await _sessionService.RemoveGroupFromSessionAsync(sessionId, groupId);

            if (!result)
            {
                return NotFound(new { message = "Session or group enrollment not found" });
            }

            return NoContent();
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingSessions()
        {
            var sessions = await _sessionService.GetUpcomingSessionsAsync();
            return Ok(sessions);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayActiveSessions()
        {
            var sessions = await _sessionService.GetTodayActiveSessionsAsync();
            return Ok(sessions);
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetSessionsByStudent(string studentId)
        {
            var sessions = await _sessionService.GetSessionsByStudentIdAsync(studentId);
            return Ok(sessions);
        }
    }
}
