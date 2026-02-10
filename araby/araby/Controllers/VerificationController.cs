using araby.Data;
using araby.DTOs;
using araby.Models;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace araby.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAttendanceService _attendanceService;
        private readonly IQRCodeService _qrCodeService;
        private readonly IStudentGroupService _groupService;

        public VerificationController(
            ApplicationDbContext context, 
            IAttendanceService attendanceService,
            IQRCodeService qrCodeService,
            IStudentGroupService groupService)
        {
            _context = context;
            _attendanceService = attendanceService;
            _qrCodeService = qrCodeService;
            _groupService = groupService;
        }

        [HttpPost("run-job")]
        public async Task<IActionResult> RunBackgroundJob()
        {
            try
            {
                await _attendanceService.MarkAbsentForTodaySessionsAsync();
                return Ok(new { message = "Background job executed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("check-attendance/{sessionId}")]
        public async Task<IActionResult> CheckAttendance(int sessionId)
        {
            var today = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time")).Date;
            
            var attendance = await _context.Attendances
                .Where(a => a.SessionId == sessionId && a.SessionDate == today)
                .Select(a => new { a.StudentId, a.Status, a.SessionDate })
                .ToListAsync();

            return Ok(attendance);
        }

        [HttpPost("simulate-scan")]
        public async Task<IActionResult> SimulateScan([FromBody] string studentNumber)
        {
            if (!int.TryParse(studentNumber, out int number))
            {
                 return BadRequest("Invalid student number format. Expected numeric string.");
            }

            var scanDto = new araby.DTOs.QRCode.QRCodeScanDto
            {
                StudentNumber = number,
                ScanTime = DateTime.UtcNow
            };

            var result = await _qrCodeService.ScanQRCodeAsync(scanDto, "Verification-Controller");
            return Ok(result);
        }
    }
}
