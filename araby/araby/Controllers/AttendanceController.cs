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
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> RecordAttendance([FromBody] CreateAttendanceDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var attendance = await _attendanceService.RecordAttendanceAsync(dto, userId);

            if (attendance == null)
            {
                return BadRequest(new { message = "Failed to record attendance" });
            }

            return CreatedAtAction(nameof(GetAttendanceBySession), 
                new { sessionId = attendance.SessionId }, attendance);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAttendance()
        {
            var attendances = await _attendanceService.GetAllAttendanceAsync();
            return Ok(attendances);
        }

        [HttpGet("session/{sessionId}")]
        public async Task<IActionResult> GetAttendanceBySession(int sessionId)
        {
            var attendances = await _attendanceService.GetAttendanceBySessionIdAsync(sessionId);
            return Ok(attendances);
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetAttendanceByStudent(string studentId)
        {
            var attendances = await _attendanceService.GetAttendanceByStudentIdAsync(studentId);
            return Ok(attendances);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] UpdateAttendanceDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _attendanceService.UpdateAttendanceAsync(id, dto);

            if (!result)
            {
                return NotFound(new { message = "Attendance record not found or update failed" });
            }

            return Ok(new { message = "Attendance updated successfully" });
        }

        [HttpGet("statistics/student/{studentId}")]
        public async Task<IActionResult> GetStudentStatistics(string studentId)
        {
            var statistics = await _attendanceService.GetStudentAttendanceStatisticsAsync(studentId);
            return Ok(statistics);
        }

        [HttpGet("statistics/overall")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetOverallStatistics()
        {
            var statistics = await _attendanceService.GetOverallAttendanceStatisticsAsync();
            return Ok(statistics);
        }
    }
}
