using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Data;
using Microsoft.EntityFrameworkCore;


public class FileRepository : IFileRepository
{
    private readonly DataContext _context;

    public FileRepository(DataContext context)
    {
        _context = context;
    }

    // קבלת כל הקבצים
    public async Task<List<UploadedFile>> GetAllFilesAsync()
    {
        return await _context.Files.ToListAsync();
    }

    // קבלת קובץ לפי ID
    public async Task<UploadedFile> GetFileByIdAsync(int id)
    {
        var file = await _context.Files.FirstOrDefaultAsync(f => f.Id == id);
        if (file == null)
            throw new KeyNotFoundException($"File with id {id} was not found.");

        return file;
    }

    // קבלת כל הקבצים לפי UserId
    public async Task<List<UploadedFile>> GetFilesByUserIdAsync(int userId)
    {
        return await _context.Files.Where(f => f.UserId == userId).ToListAsync();
    }

    // הוספת קובץ חדש
    public async Task AddFileAsync(UploadedFile file)
    {
        await _context.Files.AddAsync(file);
    }

    // עדכון קובץ
    public async Task UpdateFileAsync(int id, UploadedFile file)
    {
        var existingFile = await _context.Files.SingleOrDefaultAsync(f => f.Id == id);

        if (existingFile != null)
        {
            existingFile.FileName = file.FileName;
            existingFile.FileType = file.FileType;
            existingFile.FilePath = file.FilePath;
            existingFile.UploadedAt = file.UploadedAt;
            existingFile.UserId = file.UserId;
        }
        else
        {
            throw new KeyNotFoundException($"File with id {id} was not found.");
        }
    }

    // מחיקת קובץ
    public async Task DeleteFileAsync(int id)
    {
        var file = await _context.Files.SingleOrDefaultAsync(f => f.Id == id);

        if (file != null)
        {
            _context.Files.Remove(file);
        }
        else
        {
            throw new KeyNotFoundException($"File with id {id} was not found.");
        }
    }

    public async Task UpdateFileAccessTypeAsync(int fileId, FileAccessTypeEnum newAccessType)
    {
        var file = await _context.Files.FindAsync(fileId);
        if (file == null)
        {
            throw new KeyNotFoundException("File not found");
        }

        file.AccessType = newAccessType;
    }




}
