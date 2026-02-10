using System.Text.Json.Serialization;

namespace araby.Models
{
    /// <summary>
    /// Represents the recurring pattern for sessions.
    /// Stored as JSON in Session.RecurringPattern field.
    /// </summary>
    public class RecurringPattern
    {
        /// <summary>
        /// Days of the week when session recurs.
        /// 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        /// </summary>
        [JsonPropertyName("daysOfWeek")]
        public List<int> DaysOfWeek { get; set; } = new();

        /// <summary>
        /// Optional end date for recurrence.
        /// If null, recurs indefinitely.
        /// </summary>
        [JsonPropertyName("endDate")]
        public DateTime? EndDate { get; set; }
    }
}
