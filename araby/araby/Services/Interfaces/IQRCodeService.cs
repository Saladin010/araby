using araby.DTOs.QRCode;

namespace araby.Services.Interfaces
{
    public interface IQRCodeService
    {
        /// <summary>
        /// Get student QR code data by student ID
        /// </summary>
        Task<StudentQRDataDto?> GetStudentQRDataAsync(string studentId);

        /// <summary>
        /// Scan QR code and record attendance
        /// </summary>
        Task<QRCodeAttendanceResultDto> ScanQRCodeAsync(QRCodeScanDto scanDto, string scannedBy);
    }
}
