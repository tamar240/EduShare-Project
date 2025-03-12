using EduShare.Core.Entities;
using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Repositories
{
    public interface IFileRepository
    {
        Task<List<UploadedFile>> GetAllFilesAsync();
        Task<UploadedFile> GetFileByIdAsync(int id);
        Task<List<UploadedFile>> GetFilesByUserIdAsync(int userId);
        Task AddFileAsync(UploadedFile file);
        Task UpdateFileAsync(int id, UploadedFile file);
        Task DeleteFileAsync(int id);
        Task UpdateFileAccessTypeAsync(int fileId, FileAccessTypeEnum newAccessType);
    }
}
