using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduShare.Core.Services
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync();
        Task<UserRoles?> GetUserByNameAndPassword(string username, string password);

        Task<User> GetUserByIdAsync(int id);
        Task<User?> GetUserByNameAsync(string name);
        Task<User> GetUserByEmailAsync(string email);
       Task<UserDTO> AddAsync(UserDTO user, string roleName);
        Task UpdateUserAsync(int id, User user);
        Task DeleteUserAsync(int id);
    }
}
