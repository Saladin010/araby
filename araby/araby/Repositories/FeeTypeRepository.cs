using araby.Data;
using araby.Models;
using araby.Repositories.Interfaces;

namespace araby.Repositories
{
    public class FeeTypeRepository : GenericRepository<FeeType>, IFeeTypeRepository
    {
        public FeeTypeRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
