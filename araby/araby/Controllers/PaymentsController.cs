using araby.DTOs;
using araby.Models;
using araby.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace araby.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> RecordPayment([FromBody] CreatePaymentDto dto)
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

            var payment = await _paymentService.RecordPaymentAsync(dto, userId);

            if (payment == null)
            {
                return BadRequest(new { message = "Failed to record payment" });
            }

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetPaymentsByStudent(string studentId)
        {
            var payments = await _paymentService.GetPaymentsByStudentIdAsync(studentId);
            return Ok(payments);
        }

        [HttpGet]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetAllPayments(
            [FromQuery] string? studentId,
            [FromQuery] int? feeTypeId,
            [FromQuery] PaymentStatus? status,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var payments = await _paymentService.GetAllPaymentsAsync(
                studentId, feeTypeId, status, startDate, endDate);
            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);

            if (payment == null)
            {
                return NotFound(new { message = "Payment not found" });
            }

            return Ok(payment);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _paymentService.UpdatePaymentStatusAsync(id, dto.Status);

            if (!result)
            {
                return NotFound(new { message = "Payment not found or update failed" });
            }

            return Ok(new { message = "Payment status updated successfully" });
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetPendingPayments()
        {
            var payments = await _paymentService.GetPendingPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("overdue")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> GetOverduePayments()
        {
            var payments = await _paymentService.GetOverduePaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("statistics")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetPaymentStatistics()
        {
            var statistics = await _paymentService.GetPaymentStatisticsAsync();
            return Ok(statistics);
        }

        // NEW ENDPOINTS for automatic payment system
        [HttpPost("assign")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> AssignFeeToStudents([FromBody] AssignFeeDto dto)
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

            var payments = await _paymentService.AssignFeeToStudentsAsync(dto, userId);

            return Ok(new
            {
                message = "تم تعيين الرسوم بنجاح",
                count = payments.Count(),
                payments
            });
        }

        [HttpPost("{id}/pay")]
        [Authorize(Roles = "Teacher,Assistant")]
        public async Task<IActionResult> RecordPayment(int id, [FromBody] RecordPaymentDto dto)
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

            try
            {
                var payment = await _paymentService.RecordPaymentAgainstFeeAsync(id, dto.AmountPaid, userId);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
