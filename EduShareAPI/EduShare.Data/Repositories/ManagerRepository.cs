
using EduShare.Core.Repositories;
using EduShare.Data;
using System.Threading.Tasks;

namespace EduShare.Data.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly DataContext _context;

        public IFileRepository Files { get; }
        public IUserRepository Users { get; }
        public IInstitutionRepository Institutions { get; }
        public IUserRolesRepository UserRoles { get; }
        public IRoleRpository Roles { get; }

        public ManagerRepository(DataContext context,
            IFileRepository fileRepository,
            IUserRepository userRepository,
            IInstitutionRepository institutionRepository,
            IUserRolesRepository userRolesRepository,
            IRoleRpository roleRpository)
        {
            _context = context;
            Files = fileRepository;
            Users = userRepository;
            Institutions = institutionRepository;
            UserRoles = userRolesRepository;
            Roles = roleRpository;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
