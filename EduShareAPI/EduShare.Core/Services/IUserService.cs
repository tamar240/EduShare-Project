using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduShare.Core.Services
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task<List<User>> GetUsersByInstitutionAsync(string institutionCode);
       Task<UserDTO> AddAsync(UserDTO user, string roleName);
        Task UpdateUserAsync(int id, User user);
        Task DeleteUserAsync(int id);
        Task<UserRoles?> GetUserByNameAndPassword(string username, string password);
    }
}
