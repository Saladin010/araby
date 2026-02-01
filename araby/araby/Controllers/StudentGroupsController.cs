using araby.DTOs;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace araby.Controllers
{
    [ApiController]
    [Route("api/student-groups")]
    [Authorize]
    public class StudentGroupsController : ControllerBase
    {
        private readonly IStudentGroupService _studentGroupService;

        public StudentGroupsController(IStudentGroupService studentGroupService)
        {
            _studentGroupService = studentGroupService;
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateStudentGroupDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var group = await _studentGroupService.CreateGroupAsync(dto);

            if (group == null)
            {
                return BadRequest(new { message = "Failed to create group" });
            }

            return CreatedAtAction(nameof(GetGroup), new { id = group.Id }, group);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGroups()
        {
            var groups = await _studentGroupService.GetAllGroupsAsync();
            return Ok(groups);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroup(int id)
        {
            var group = await _studentGroupService.GetGroupByIdAsync(id);

            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            return Ok(group);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> UpdateGroup(int id, [FromBody] UpdateStudentGroupDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _studentGroupService.UpdateGroupAsync(id, dto);

            if (!result)
            {
                return NotFound(new { message = "Group not found or update failed" });
            }

            return Ok(new { message = "Group updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var result = await _studentGroupService.DeleteGroupAsync(id);

            if (!result)
            {
                return NotFound(new { message = "Group not found" });
            }

            return NoContent();
        }

        [HttpPost("{id}/students")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> AddStudentsToGroup(int id, [FromBody] List<string> studentIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _studentGroupService.AddStudentsToGroupAsync(id, studentIds);

            if (!result)
            {
                return NotFound(new { message = "Group not found" });
            }

            return Ok(new { message = "Students added successfully" });
        }

        [HttpDelete("{groupId}/students/{studentId}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> RemoveStudentFromGroup(int groupId, string studentId)
        {
            var result = await _studentGroupService.RemoveStudentFromGroupAsync(groupId, studentId);

            if (!result)
            {
                return NotFound(new { message = "Group or student membership not found" });
            }

            return NoContent();
        }

        [HttpGet("{id}/statistics")]
        public async Task<IActionResult> GetGroupStatistics(int id)
        {
            var stats = await _studentGroupService.GetGroupStatisticsAsync(id);

            if (stats == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            return Ok(stats);
        }
    }
}
