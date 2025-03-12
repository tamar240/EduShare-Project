using EduShare.Core.Entities;
using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Services
{
    public interface IFileService
    {
        Task<List<UploadedFile>> GetAllFiles();  // קבלת כל הקבצים
        Task<UploadedFile> GetFileById(int id);  // קבלת קובץ לפי ID
        Task<List<UploadedFile>> GetFilesByUserId(int userId);  // קבלת כל הקבצים של משתמש מסוים
        Task AddFile(UploadedFile file);  // הוספת קובץ
        Task UpdateFile(int id, UploadedFile file);  // עדכון קובץ
        Task DeleteFile(int id);  // מחיקת קובץ
        Task UpdateFileAccessType(int fileId, FileAccessTypeEnum accessType);

    }
}
