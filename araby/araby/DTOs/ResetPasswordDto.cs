using System.ComponentModel.DataAnnotations;

namespace araby.DTOs
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "كلمة المرور الجديدة مطلوبة")]
        [MinLength(6, ErrorMessage = "يجب أن تكون كلمة المرور 6 أحرف على الأقل")]
        public string NewPassword { get; set; }
    }
}
