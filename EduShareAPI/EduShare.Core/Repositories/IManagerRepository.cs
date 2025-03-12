using EduShare.Core.Entities;



namespace EduShare.Core.Repositories
{
    public interface IManagerRepository
    {
        IFileRepository Files { get; }
        IUserRepository Users { get; }
        IInstitutionRepository Institutions { get; }
         IUserRolesRepository UserRoles { get; }
         IRoleRpository Roles { get; }
        Task SaveAsync();
    }
}
