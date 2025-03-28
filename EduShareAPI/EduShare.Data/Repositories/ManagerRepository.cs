
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
        public IUserRolesRepository UserRoles { get; }
        public IRoleRepository Roles { get; }
        public ISubjectRepository Subjects { get; set; }
        public ILessonRepository Lessons { get; set; }

        public ManagerRepository(DataContext context,
            IFileRepository fileRepository,
            IUserRepository userRepository,
            IUserRolesRepository userRolesRepository,
            IRoleRepository roleRpository,
            ISubjectRepository subjects,
            ILessonRepository lessons)
        {
            _context = context;
            Files = fileRepository;
            Users = userRepository;
            UserRoles = userRolesRepository;
            Roles = roleRpository;
            Subjects = subjects;
            Lessons = lessons;
        }

        public async Task SaveAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving changes: {ex.Message}");
                throw;
            }
        }
    }
}
