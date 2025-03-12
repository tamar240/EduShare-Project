using EduShare.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduShare.Core.Services
{
    public interface IInstitutionService
    {
        Task<List<Institution>> GetAllInstitutions();  // קבלת כל המוסדות
        Task<Institution> GetInstitutionById(int id);  // קבלת מוסד לפי מזהה
        Task<Institution> GetInstitutionByName(string name);  // קבלת מוסד לפי שם
        Task AddInstitution(Institution institution);  // הוספת מוסד
        Task UpdateInstitution(int id, Institution institution);  // עדכון מוסד
        Task DeleteInstitution(int id);  // מחיקת מוסד
    }
}
