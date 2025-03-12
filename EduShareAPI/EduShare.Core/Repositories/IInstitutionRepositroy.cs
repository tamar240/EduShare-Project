using EduShare.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Repositories
{
    public interface IInstitutionRepository
    {
        Task<List<Institution>> GetAllInstitutionsAsync(); // קבלת כל המוסדות
        Task<Institution> GetInstitutionByIdAsync(int id); // קבלת מוסד לפי ID
        Task<Institution> GetInstitutionByNameAsync(string name); // קבלת מוסד לפי שם
        Task AddInstitutionAsync(Institution institution); // הוספת מוסד חדש
        Task UpdateInstitutionAsync(int id, Institution institution); // עדכון פרטי מוסד
        Task DeleteInstitutionAsync(int id); // מחיקת מוסד
    }
}
