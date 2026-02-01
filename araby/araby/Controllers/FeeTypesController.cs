using araby.DTOs;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace araby.Controllers
{
    [ApiController]
    [Route("api/fee-types")]
    [Authorize]
    public class FeeTypesController : ControllerBase
    {
        private readonly IFeeTypeService _feeTypeService;

        public FeeTypesController(IFeeTypeService feeTypeService)
        {
            _feeTypeService = feeTypeService;
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> CreateFeeType([FromBody] CreateFeeTypeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("userId")?.Value;

            var feeType = await _feeTypeService.CreateFeeTypeAsync(dto, userId);

            if (feeType == null)
            {
                return BadRequest(new { message = "Failed to create fee type" });
            }

            return CreatedAtAction(nameof(GetFeeType), new { id = feeType.Id }, feeType);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFeeTypes()
        {
            var feeTypes = await _feeTypeService.GetAllFeeTypesAsync();
            return Ok(feeTypes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeeType(int id)
        {
            var feeType = await _feeTypeService.GetFeeTypeByIdAsync(id);

            if (feeType == null)
            {
                return NotFound(new { message = "Fee type not found" });
            }

            return Ok(feeType);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> UpdateFeeType(int id, [FromBody] UpdateFeeTypeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _feeTypeService.UpdateFeeTypeAsync(id, dto);

            if (!result)
            {
                return NotFound(new { message = "Fee type not found or update failed" });
            }

            return Ok(new { message = "Fee type updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteFeeType(int id)
        {
            var result = await _feeTypeService.DeleteFeeTypeAsync(id);

            if (!result)
            {
                return NotFound(new { message = "Fee type not found" });
            }

            return NoContent();
        }

        [HttpPost("{id}/groups")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AssignGroups(int id, [FromBody] AssignGroupsDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _feeTypeService.AssignGroupsToFeeTypeAsync(id, dto.GroupIds, dto.AutoAssignToMembers);

            if (!result)
            {
                return NotFound(new { message = "Fee type not found" });
            }

            return Ok(new { message = "Groups assigned successfully" });
        }
    }
}
