using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Core.Services;
using EduShare.Service;
using Microsoft.EntityFrameworkCore;


namespace EduShare.Data.Services
{
    public class FileService : IFileService
    {

        private readonly IManagerRepository _repositoryManager;
        private readonly IUserService _userService;
        private readonly S3Service _s3Service;

        public FileService(IManagerRepository repositoryManager, IUserService userService, S3Service s3Service)
        {
            _repositoryManager = repositoryManager;
            _userService = userService;
            _s3Service = s3Service;
        }

        public async Task<UploadedFile> AddFileAsync(UploadedFile file,int userId)
        {
            file.OwnerId = userId;
            file.S3Key = file.S3Key;

            await _repositoryManager.Files.AddAsync(file);
            await _repositoryManager.SaveAsync();

            return file;  // מחזיר את הקובץ שהוסף
        }

        public async Task<List<UploadedFile>> GetFilesByUserIdAsync(int userId)
        {
            return await _repositoryManager.Files.GetAllByUserIdAsync(userId);
        }

        public async Task<List<UploadedFile>> GetFilesByLessonIdAsync(int id, int userId)
        {
            return await _repositoryManager.Files.GetFilesByLessonIdAsync(id,userId);
        }

        public async Task<List<UploadedFile>> GetAllFilesAsync()
        {
            return await _repositoryManager.Files.GetAllFilesAsync();
        }

        public async Task<UploadedFile> GetFileByIdAsync(int id,int userId)
        {
            return await _repositoryManager.Files.GetFileByIdAsync(id,userId);
        }
        public async Task<UploadedFile> GetDeletedFileByIdAsync(int id,int userId)
        {
            return await _repositoryManager.Files.GetFileByIdAsync(id,userId);
        }
        public async Task<List<UploadedFile>> GetDeletedFilesByUserIdAsync(int userId)
        {
            return await _repositoryManager.Files.GetDeletedFilesByUserIdAsync(userId);
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

        public async Task HardDeleteFileAsync(int id, int userId)
        {
            var file = await _repositoryManager.Files.GetDeletedFileByIdAsync(id, userId);
            if (file == null)
                throw new KeyNotFoundException("file not found.");

            // מחיקה מ-S3
            await _s3Service.DeleteFileAsync(file.S3Key);

            // מחיקה אמיתית מה-DB
            await _repositoryManager.Files.HardDeleteAsync(id);
            await _repositoryManager.SaveAsync();

        }

        public async Task RestoreDeletedFileAsync(int fileId, int userId)
        {
            var file = await _repositoryManager.Files.GetDeletedFileByIdAsync(fileId, userId);

            if (file == null)
                Console.WriteLine("file in service is null");
            else
            {
                Console.WriteLine($"file in s: {file.FileName} {file.IsDeleted}");
            }

            if (file == null || !file.IsDeleted)
                throw new KeyNotFoundException("File not found or not deleted.");

            await _repositoryManager.Files.RestoreAsync(fileId);
            await _repositoryManager.SaveAsync();
        }

    }


    //public async Task UpdateFileAccessTypeAsync(int fileId, FileAccessTypeEnum newAccessType)
    //{
    //    await _repositoryManager.Files.UpdateFileAccessTypeAsync(fileId, newAccessType);
    //    await _repositoryManager.SaveAsync();
    //}

}

