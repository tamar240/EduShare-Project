using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Models;

namespace EduShare.Core.Services
{
    public interface IFileService
    {
        Task<UploadedFile> AddFileAsync(UploadedFile file,int userId);
        Task<List<UploadedFile>> GetFilesByUserIdAsync(int userId);
        Task<List<UploadedFile>> GetFilesByLessonIdAsync(int id,int userId);
        Task<List<UploadedFile>> GetAllFilesAsync();
        Task<UploadedFile> GetFileByIdAsync(int id,int userId);
        Task<UploadedFile> GetDeletedFileByIdAsync(int id, int userId);
        Task<List<UploadedFile>> GetDeletedFilesByUserIdAsync(int userId);

        Task UpdateFileAsync(int id, UploadedFile file);
        Task DeleteFileAsync(int id);
        Task HardDeleteFileAsync(int id, int userId);
        Task RestoreDeletedFileAsync(int fileId, int userId);

        //Task UpdateFileAccessTypeAsync(int fileId, FileAccessTypeEnum newAccessType);

    }
}
