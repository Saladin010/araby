using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace araby.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("financial/monthly")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetMonthlyFinancialReport([FromQuery] int? year, [FromQuery] int? month)
        {
            // Use current Egypt time if not provided
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
            var reportYear = year ?? egyptNow.Year;
            var reportMonth = month ?? egyptNow.Month;

            // Validate month
            if (reportMonth < 1 || reportMonth > 12)
            {
                return BadRequest(new { message = "Month must be between 1 and 12" });
            }

            var report = await _reportService.GetMonthlyFinancialReportAsync(reportYear, reportMonth);
            return Ok(report);
        }

        [HttpGet("attendance/summary")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetAttendanceSummary()
        {
            var report = await _reportService.GetAttendanceSummaryReportAsync();
            return Ok(report);
        }

        [HttpGet("students/performance")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetStudentsPerformance()
        {
            var report = await _reportService.GetStudentsPerformanceReportAsync();
            return Ok(report);
        }

        [HttpGet("payments/defaulters")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetPaymentDefaulters()
        {
            var report = await _reportService.GetPaymentDefaultersAsync();
            return Ok(report);
        }
        [HttpGet("students/{studentId}")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetComprehensiveStudentReport(string studentId)
        {
            var report = await _reportService.GetStudentComprehensiveReportAsync(studentId);
            if (report == null) return NotFound("Student not found");
            return Ok(report);
        }
    }
}
