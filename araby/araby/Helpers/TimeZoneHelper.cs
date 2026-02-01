namespace araby.Helpers
{
    /// <summary>
    /// Helper class for Egypt Standard Time operations
    /// </summary>
    public static class TimeZoneHelper
    {
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        /// <summary>
        /// Gets the current time in Egypt Standard Time
        /// </summary>
        /// <returns>Current DateTime in Egypt timezone</returns>
        public static DateTime GetEgyptTime()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);
        }

        /// <summary>
        /// Converts UTC time to Egypt Standard Time
        /// </summary>
        /// <param name="utcTime">UTC DateTime to convert</param>
        /// <returns>DateTime in Egypt timezone</returns>
        public static DateTime ConvertToEgyptTime(DateTime utcTime)
        {
            if (utcTime.Kind != DateTimeKind.Utc)
            {
                utcTime = DateTime.SpecifyKind(utcTime, DateTimeKind.Utc);
            }
            return TimeZoneInfo.ConvertTimeFromUtc(utcTime, EgyptTimeZone);
        }
    }
}
