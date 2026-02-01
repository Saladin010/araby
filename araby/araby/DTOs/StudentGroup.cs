namespace araby.DTOs
{
    // DTOs/StudentGroup/CreateStudentGroupDto.cs
    public class CreateStudentGroupDto
    {
        public string GroupName { get; set; }
        public string Description { get; set; }
    }

    // DTOs/StudentGroup/StudentGroupDto.cs
    public class StudentGroupDto
    {
        public int Id { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public int MembersCount { get; set; }
    }

    // DTOs/StudentGroup/StudentGroupDetailsDto.cs
    public class StudentGroupDetailsDto
    {
        public int Id { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public int MembersCount { get; set; }
        public List<GroupMemberDto> Members { get; set; }
        public List<FeeTypeDto> ApplicableFees { get; set; }
    }

    // DTOs/StudentGroup/GroupMemberDto.cs
    public class GroupMemberDto
    {
        public string StudentId { get; set; }
        public string FullName { get; set; }
        public string AcademicLevel { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    // DTOs/StudentGroup/UpdateStudentGroupDto.cs
    public class UpdateStudentGroupDto
    {
        public string GroupName { get; set; }
        public string Description { get; set; }
    }

    // DTOs/StudentGroup/AddStudentsToGroupDto.cs
    public class AddStudentsToGroupDto
    {
        public List<string> StudentIds { get; set; }
    }
}
