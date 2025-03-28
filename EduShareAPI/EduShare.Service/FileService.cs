using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Core.Services;
using EduShare.Service;


namespace EduShare.Data.Services
{
    public class FileService : IFileService
    {

        private readonly IManagerRepository _repositoryManager;
        private readonly IUserService _userService;

        public FileService(IManagerRepository repositoryManager, IUserService userService)
        {
            _repositoryManager = repositoryManager;
            _userService = userService;
        }

        public async Task<UploadedFile> AddFileAsync(UploadedFile file,int userId)
        {
            file.OwnerId = userId;
            file.S3Key = $"{userId}/{file.FileName}";

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

        public async Task<UploadedFile> GetFileByIdAsync(int id,int userId)
        {


            return await _repositoryManager.Files.GetFileByIdAsync(id,userId);
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
