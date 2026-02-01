using araby.DTOs;

namespace araby.Services.Interfaces
{
    public interface IReportService
    {
        Task<MonthlyFinancialReportDto> GetMonthlyFinancialReportAsync(int year, int month);
        Task<AttendanceSummaryReportDto> GetAttendanceSummaryReportAsync();
        Task<IEnumerable<StudentPerformanceReportDto>> GetStudentsPerformanceReportAsync();
        Task<IEnumerable<PaymentDefaulterDto>> GetPaymentDefaultersAsync();
    }
}
