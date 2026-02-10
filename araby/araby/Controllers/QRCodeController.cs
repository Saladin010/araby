using araby.DTOs.QRCode;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace araby.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QRCodeController : ControllerBase
    {
        private readonly IQRCodeService _qrCodeService;

        public QRCodeController(IQRCodeService qrCodeService)
        {
            _qrCodeService = qrCodeService;
        }

        /// <summary>
        /// Get student QR code data
        /// Accessible by: Teacher, Assistant, or the student themselves
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentQRData(string studentId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            // Check authorization: Teacher/Assistant can access any student, students can only access their own
            if (userRole != "1" && userRole != "2" && currentUserId != studentId)
            {
                return Forbid();
            }

            var qrData = await _qrCodeService.GetStudentQRDataAsync(studentId);
            
            if (qrData == null)
            {
                return NotFound(new { message = "لم يتم العثور على بيانات الطالب" });
            }

            return Ok(qrData);
        }

        /// <summary>
        /// Scan QR code and record attendance
        /// Accessible by: Teacher, Assistant only
        /// </summary>
        [HttpPost("scan")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> ScanQRCode([FromBody] QRCodeScanDto scanDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var result = await _qrCodeService.ScanQRCodeAsync(scanDto, currentUserId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
