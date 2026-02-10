namespace araby.Models
{
    /// <summary>
    /// Configuration settings for attendance system
    /// </summary>
    public class AttendanceSettings
    {
        /// <summary>
        /// Allow students to scan QR code before session starts
        /// </summary>
        public bool AllowEarlyScan { get; set; } = true;

        /// <summary>
        /// Number of minutes before session start that early scanning is allowed
        /// </summary>
        public int EarlyScanMinutes { get; set; } = 30;

        /// <summary>
        /// Interval in minutes for background service to check and pre-mark attendance
        /// </summary>
        public int PreMarkingIntervalMinutes { get; set; } = 2;

        /// <summary>
        /// Minutes after session start time to still consider as "Present" (not late)
        /// </summary>
        public int OnTimeGraceMinutes { get; set; } = 15;
    }
}
