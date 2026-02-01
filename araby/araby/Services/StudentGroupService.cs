using araby.Data;
using araby.DTOs;
using araby.Models;
using araby.Repositories.Interfaces;
using araby.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Services
{
    public class StudentGroupService : IStudentGroupService
    {
        private readonly IStudentGroupRepository _studentGroupRepository;
        private readonly ApplicationDbContext _context;
        private static readonly TimeZoneInfo EgyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public StudentGroupService(IStudentGroupRepository studentGroupRepository, ApplicationDbContext context)
        {
            _studentGroupRepository = studentGroupRepository;
            _context = context;
        }

        public async Task<StudentGroupDto> CreateGroupAsync(CreateStudentGroupDto dto)
        {
            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            var group = new StudentGroup
            {
                GroupName = dto.GroupName,
                Description = dto.Description,
                CreatedAt = egyptNow
            };

            var createdGroup = await _studentGroupRepository.AddAsync(group);
            return MapToStudentGroupDto(createdGroup);
        }

        public async Task<IEnumerable<StudentGroupDto>> GetAllGroupsAsync()
        {
            var groups = await _studentGroupRepository.GetAllAsync();
            var groupDtos = new List<StudentGroupDto>();

            foreach (var group in groups)
            {
                groupDtos.Add(await MapToStudentGroupDtoWithCountAsync(group));
            }

            return groupDtos;
        }

        public async Task<StudentGroupDetailsDto> GetGroupByIdAsync(int groupId)
        {
            var group = await _studentGroupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                return null;
            }

            return await MapToStudentGroupDetailsDtoAsync(group);
        }

        public async Task<bool> UpdateGroupAsync(int groupId, UpdateStudentGroupDto dto)
        {
            var group = await _studentGroupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                return false;
            }

            group.GroupName = dto.GroupName;
            group.Description = dto.Description;

            await _studentGroupRepository.UpdateAsync(group);
            return true;
        }

        public async Task<bool> DeleteGroupAsync(int groupId)
        {
            var group = await _studentGroupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                return false;
            }

            await _studentGroupRepository.DeleteAsync(group);
            return true;
        }

        public async Task<bool> AddStudentsToGroupAsync(int groupId, List<string> studentIds)
        {
            var group = await _studentGroupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                return false;
            }

            var egyptNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EgyptTimeZone);

            foreach (var studentId in studentIds)
            {
                // Check if student is already in the group
                var exists = await _context.StudentGroupMembers
                    .AnyAsync(sgm => sgm.StudentGroupId == groupId && sgm.StudentId == studentId);

                if (!exists)
                {
                    var member = new StudentGroupMember
                    {
                        StudentGroupId = groupId,
                        StudentId = studentId,
                        AddedAt = egyptNow
                    };

                    _context.StudentGroupMembers.Add(member);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveStudentFromGroupAsync(int groupId, string studentId)
        {
            var member = await _context.StudentGroupMembers
                .FirstOrDefaultAsync(sgm => sgm.StudentGroupId == groupId && sgm.StudentId == studentId);

            if (member == null)
            {
                return false;
            }

            _context.StudentGroupMembers.Remove(member);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetGroupStatisticsAsync(int groupId)
        {
            var group = await _studentGroupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                return null;
            }

            // Get all student IDs in the group
            var studentIds = await _context.StudentGroupMembers
                .Where(sgm => sgm.StudentGroupId == groupId)
                .Select(sgm => sgm.StudentId)
                .ToListAsync();

            var totalStudents = studentIds.Count;

            if (totalStudents == 0)
            {
                return new
                {
                    totalStudents = 0,
                    averageAttendance = 0,
                    averageGrade = 0,
                    totalPaid = 0,
                    pendingPayments = 0
                };
            }

            // Calculate average attendance
            var attendanceRecords = await _context.Attendances
                .Where(a => studentIds.Contains(a.StudentId))
                .ToListAsync();

            var totalAttendance = attendanceRecords.Count;
            var presentCount = attendanceRecords.Count(a => a.Status == AttendanceStatus.Present);
            var averageAttendance = totalAttendance > 0 ? (int)Math.Round((double)presentCount / totalAttendance * 100) : 0;

            // Calculate average grade
            var grades = await _context.Grades
                .Where(g => studentIds.Contains(g.StudentId))
                .ToListAsync();

            var averageGrade = grades.Any() ? (int)Math.Round(grades.Average(g => g.Score)) : 0;

            // Calculate payment statistics
            // First, get FeeTypes associated with this group
            var feeTypeIds = await _context.FeeTypeGroups
                .Where(ftg => ftg.StudentGroupId == groupId)
                .Select(ftg => ftg.FeeTypeId)
                .ToListAsync();

            var payments = await _context.StudentPayments
                .Where(p => studentIds.Contains(p.StudentId) && 
                            feeTypeIds.Contains(p.FeeTypeId))
                .ToListAsync();

            var totalPaid = payments.Sum(p => p.AmountPaid);
            var pendingPayments = payments.Count(p => !p.IsFullyPaid);

            return new
            {
                totalStudents,
                averageAttendance,
                averageGrade,
                totalPaid,
                pendingPayments
            };
        }

        private StudentGroupDto MapToStudentGroupDto(StudentGroup group)
        {
            return new StudentGroupDto
            {
                Id = group.Id,
                GroupName = group.GroupName,
                Description = group.Description,
                CreatedAt = group.CreatedAt,
                MembersCount = 0
            };
        }

        private async Task<StudentGroupDto> MapToStudentGroupDtoWithCountAsync(StudentGroup group)
        {
            var count = await _context.StudentGroupMembers
                .CountAsync(sgm => sgm.StudentGroupId == group.Id);

            return new StudentGroupDto
            {
                Id = group.Id,
                GroupName = group.GroupName,
                Description = group.Description,
                CreatedAt = group.CreatedAt,
                MembersCount = count
            };
        }

        private async Task<StudentGroupDetailsDto> MapToStudentGroupDetailsDtoAsync(StudentGroup group)
        {
            // Get members with student details
            var members = await _context.StudentGroupMembers
                .Where(sgm => sgm.StudentGroupId == group.Id)
                .Include(sgm => sgm.Student)
                .Select(sgm => new GroupMemberDto
                {
                    StudentId = sgm.StudentId,
                    FullName = sgm.Student.FullName,
                    AcademicLevel = sgm.Student.AcademicLevel,
                    JoinedAt = sgm.AddedAt
                })
                .ToListAsync();

            // Get applicable fee types
            var feeTypes = await _context.FeeTypeGroups
                .Where(ftg => ftg.StudentGroupId == group.Id)
                .Include(ftg => ftg.FeeType)
                .Select(ftg => new FeeTypeDto
                {
                    Id = ftg.FeeType.Id,
                    Name = ftg.FeeType.Name,
                    Amount = ftg.FeeType.Amount,
                    Frequency = ftg.FeeType.Frequency,
                    CreatedAt = ftg.FeeType.CreatedAt,
                    CreatedBy = ftg.FeeType.CreatedBy,
                    IsActive = ftg.FeeType.IsActive,
                    ApplicableGroupIds = new List<int>()
                })
                .ToListAsync();

            return new StudentGroupDetailsDto
            {
                Id = group.Id,
                GroupName = group.GroupName,
                Description = group.Description,
                CreatedAt = group.CreatedAt,
                MembersCount = members.Count,
                Members = members,
                ApplicableFees = feeTypes
            };
        }
    }
}
