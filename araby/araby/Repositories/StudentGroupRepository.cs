using araby.Data;
using araby.Models;
using araby.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace araby.Repositories
{
    public class StudentGroupRepository : GenericRepository<StudentGroup>, IStudentGroupRepository
    {
        public StudentGroupRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<StudentGroup> GetGroupWithMembersAsync(int groupId)
        {
            return await _dbSet
                .Include(g => g.Members)
                    .ThenInclude(m => m.Student)
                .Include(g => g.ApplicableFees)
                    .ThenInclude(f => f.FeeType)
                .FirstOrDefaultAsync(g => g.Id == groupId);
        }
    }
}
