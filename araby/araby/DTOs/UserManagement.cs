using araby.Models;

namespace araby.DTOs
{
    // DTOs/User/CreateStudentDto.cs
    public class CreateStudentDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string AcademicLevel { get; set; }
    }

    // DTOs/User/CreateAssistantDto.cs
    public class CreateAssistantDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
    }

    // DTOs/User/UserDto.cs
    public class UserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public UserRole Role { get; set; }
        public string AcademicLevel { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
    }

    // DTOs/User/UpdateUserDto.cs
    public class UpdateUserDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string AcademicLevel { get; set; }
    }

    // DTOs/User/UserCredentialsDto.cs
    public class UserCredentialsDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
    }

    // DTOs/User/ChangeRoleDto.cs
    public class ChangeRoleDto
    {
        public UserRole NewRole { get; set; }
    }
}
