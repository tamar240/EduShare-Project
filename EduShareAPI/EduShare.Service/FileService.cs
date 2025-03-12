using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Core.Services;

namespace EduShare.Data.Services
{
    public class FileService : IFileService
    {
        private readonly IManagerRepository _repositoryManager;

        public FileService( IManagerRepository repositoryManager)
        {
           
            _repositoryManager = repositoryManager;
        }

        public async Task<List<UploadedFile>> GetAllFiles()
        {
            return await _repositoryManager.Files.GetAllFilesAsync();
        }

        public async Task<UploadedFile> GetFileById(int id)
        {
            return await _repositoryManager.Files.GetFileByIdAsync(id);
        }

        public async Task<List<UploadedFile>> GetFilesByUserId(int userId)
        {
            return await _repositoryManager.Files.GetFilesByUserIdAsync(userId);
        }

        public async Task AddFile(UploadedFile file)
        {
            await _repositoryManager.Files.AddFileAsync(file);
            await _repositoryManager.SaveAsync();
        }

        public async Task UpdateFile(int id, UploadedFile file)
        {
            await _repositoryManager.Files.UpdateFileAsync(id, file);
            await _repositoryManager.SaveAsync();
        }

        public async Task DeleteFile(int id)
        {
            await _repositoryManager.Files.DeleteFileAsync(id);
            await _repositoryManager.SaveAsync();
        }

        public async Task UpdateFileAccessType(int fileId, FileAccessTypeEnum newAccessType)
        {
            await _repositoryManager.Files.UpdateFileAccessTypeAsync(fileId, newAccessType);
            await _repositoryManager.SaveAsync();  // שמירה ב-Service
        }
    }
}
