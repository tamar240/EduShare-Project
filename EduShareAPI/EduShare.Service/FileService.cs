using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Core.Services;

namespace EduShare.Data.Services
{
    public class FileService : IFileService
    {

        private readonly IManagerRepository _repositoryManager;

        public FileService(IManagerRepository repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<UploadedFile> AddFileAsync(UploadedFile file)
        {
            await _repositoryManager.Files.AddAsync(file);
            await _repositoryManager.SaveAsync();
            return file;  // מחזיר את הקובץ שהוסף
        }

        public async Task<List<UploadedFile>> GetFilesByUserIdAsync(int userId)
        {
            return await _repositoryManager.Files.GetAllByUserIdAsync(userId);
        }

        public async Task<List<UploadedFile>> GetFilesByLessonIdAsync(int id)
        {
            return await _repositoryManager.Files.GetFilesByLessonIdAsync(id);
        }

        public async Task<List<UploadedFile>> GetAllFilesAsync()
        {
            return await _repositoryManager.Files.GetAllFilesAsync();
        }

        public async Task UpdateFileAsync(int id, UploadedFile file)
        {
            await _repositoryManager.Files.UpdateAsync(id, file);
            await _repositoryManager.SaveAsync();
        }

        public async Task DeleteFileAsync(int id)
        {
            await _repositoryManager.Files.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }



        //public async Task UpdateFileAccessTypeAsync(int fileId, FileAccessTypeEnum newAccessType)
        //{
        //    await _repositoryManager.Files.UpdateFileAccessTypeAsync(fileId, newAccessType);
        //    await _repositoryManager.SaveAsync();
        //}

    }
}
