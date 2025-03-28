using EduShare.Core.Entities;
using System.Threading.Tasks;

namespace EduShare.Core.Repositories
{
    public interface IManagerRepository
    {
        IFileRepository Files { get; }
        IUserRepository Users { get; }
        IUserRolesRepository UserRoles { get; }
        IRoleRepository Roles { get; }  // עדכון השם מ-IRoleRpository ל-IRoleRepository
         ISubjectRepository Subjects { get; set; }
         ILessonRepository Lessons { get; set; }
        Task SaveAsync();  // שמירת שינויים במאגר הנתונים
    }
}
