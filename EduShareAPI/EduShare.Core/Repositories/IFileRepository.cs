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
        Task<UploadedFile> AddAsync(UploadedFile file);
        Task<List<UploadedFile>> GetAllFilesAsync();
        Task<List<UploadedFile>> GetFilesByLessonIdAsync(int lessonId,int userId);
        Task<List<UploadedFile>> GetAllByUserIdAsync(int id);
        Task<UploadedFile> GetFileByIdAsync(int id,int userId);
        Task UpdateAsync(int id, UploadedFile file);
        Task DeleteAsync(int id);
        //Task UpdateFileAccessTypeAsync(int fileId, FileAccessTypeEnum newAccessType);
        Task<List<UploadedFile>> GetDeletedFilesByUserIdAsync(int userId);


    }

}
