using Microsoft.AspNetCore.Identity;

namespace araby.Models
{
 
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public UserRole Role { get; set; }
        public int? StudentNumber { get; set; } // Unique number for QR code (students only)
        public string? PhoneNumber { get; set; }
        public string? AcademicLevel { get; set; } // للطلاب فقط
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; } // UserId للي عمل الأكونت
        public string? VisiblePassword { get; set; } // Stored for display purposes as requested
        public bool IsActive { get; set; }

        // Navigation Properties
        public ICollection<Session> Sessions { get; set; }
        public ICollection<Attendance> Attendances { get; set; }
        public ICollection<StudentPayment> Payments { get; set; }
        public ICollection<Grade> Grades { get; set; }
    }
}
