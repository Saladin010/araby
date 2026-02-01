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
    public class GradesController : ControllerBase
    {
        private readonly IGradeService _gradeService;

        public GradesController(IGradeService gradeService)
        {
            _gradeService = gradeService;
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> CreateGrade([FromBody] CreateGradeDto dto)
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

            var grade = await _gradeService.CreateGradeAsync(dto, userId);

            if (grade == null)
            {
                return BadRequest(new { message = "Failed to create grade. Score may exceed MaxScore" });
            }

            return CreatedAtAction(nameof(GetGrade), new { id = grade.Id }, grade);
        }

        [HttpGet]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetAllGrades()
        {
            var grades = await _gradeService.GetAllGradesAsync();
            return Ok(grades);
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetGradesByStudent(string studentId)
        {
            var grades = await _gradeService.GetGradesByStudentIdAsync(studentId);
            return Ok(grades);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGrade(int id)
        {
            var grade = await _gradeService.GetGradeByIdAsync(id);

            if (grade == null)
            {
                return NotFound(new { message = "Grade not found" });
            }

            return Ok(grade);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> UpdateGrade(int id, [FromBody] UpdateGradeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _gradeService.UpdateGradeAsync(id, dto);

            if (!result)
            {
                return BadRequest(new { message = "Grade not found or update failed. Score may exceed MaxScore" });
            }

            return Ok(new { message = "Grade updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> DeleteGrade(int id)
        {
            var result = await _gradeService.DeleteGradeAsync(id);

            if (!result)
            {
                return NotFound(new { message = "Grade not found" });
            }

            return NoContent();
        }

        [HttpGet("student/{studentId}/statistics")]
        public async Task<IActionResult> GetStudentStatistics(string studentId)
        {
            var statistics = await _gradeService.GetStudentGradeStatisticsAsync(studentId);
            return Ok(statistics);
        }
    }
}
