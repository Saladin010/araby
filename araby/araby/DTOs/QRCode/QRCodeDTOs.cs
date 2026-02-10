namespace araby.DTOs.QRCode
{
    /// <summary>
    /// DTO for student QR code data
    /// </summary>
    public class StudentQRDataDto
    {
        public string StudentId { get; set; }
        public int StudentNumber { get; set; }
        public string FullName { get; set; }
        public string? AcademicLevel { get; set; }
    }

    /// <summary>
    /// DTO for QR code scan request
    /// </summary>
    public class QRCodeScanDto
    {
        public int StudentNumber { get; set; }
        public DateTime ScanTime { get; set; }
    }

    /// <summary>
    /// DTO for QR code attendance result
    /// </summary>
    public class QRCodeAttendanceResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string? StudentName { get; set; }
        public string? SessionTitle { get; set; }
        public int? Status { get; set; } // 0 = Present, 1 = Late, 2 = Absent
        public DateTime? ScannedAt { get; set; }
    }
}
