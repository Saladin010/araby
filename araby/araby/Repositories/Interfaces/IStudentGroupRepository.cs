using araby.Models;

namespace araby.Repositories.Interfaces
{
    public interface IStudentGroupRepository : IGenericRepository<StudentGroup>
    {
        Task<StudentGroup> GetGroupWithMembersAsync(int groupId);
    }
}
