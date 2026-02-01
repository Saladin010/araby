using araby.Models;

namespace araby.DTOs
{
    // DTOs/Auth/LoginDto.cs
    public class LoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    // DTOs/Auth/LoginResponseDto.cs
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public UserRole Role { get; set; }
    }

    // DTOs/Auth/CurrentUserDto.cs
    public class CurrentUserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public UserRole Role { get; set; }
        public string AcademicLevel { get; set; }
        public bool IsActive { get; set; }
    }
}
