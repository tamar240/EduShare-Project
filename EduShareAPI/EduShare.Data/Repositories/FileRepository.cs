using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Data;
using EduShare.Data.Repositories;
using Microsoft.EntityFrameworkCore;

public class FileRepository : IFileRepository
{
    private readonly DataContext _context;
    private readonly UserContextRepository _userContextRepository;
    //private readonly int userId;


    public FileRepository(DataContext context,UserContextRepository userContextRepository)
    {
        _context = context;
        _userContextRepository = userContextRepository;
        
    }

    public async Task<UploadedFile> AddAsync(UploadedFile file)
    {
        var userId = _userContextRepository.GetCurrentUserId();
        file.OwnerId = userId;
        _context.Files.Add(file);
        return file;
    }
    public async Task<UploadedFile> GetFileByIdAsync(int id)
    {
        var file = await _context.Files.FindAsync(id);
        if (file == null)
        {
            throw new KeyNotFoundException($"File with ID {id} not found.");
        }
        var userId = _userContextRepository.GetCurrentUserId();

        if (file.OwnerId != userId)
        {
            throw new UnauthorizedAccessException("You do not have permission to access this file.");
        }

        return file;
    }

    public async Task<List<UploadedFile>> GetFilesByLessonIdAsync(int lessonId)
    {
        return await _context.Files
            .Where(f => f.LessonId == lessonId) // מסנן רק קבצים ששייכים לשיעור
            .ToListAsync();
    }

    public async Task<List<UploadedFile>> GetAllByUserIdAsync(int id)//מיותר בעיקרון
    {
        return await _context.Files.Where(f => f.OwnerId==id).ToListAsync();
    }
    public async Task<List<UploadedFile>> GetAllFilesAsync()
    {
        return await _context.Files.ToListAsync();
    }

    public async Task UpdateAsync(int id, UploadedFile updatedFile)
    {
        var existingFile = await _context.Files.FindAsync(id);
        if (existingFile == null)
        {
            throw new KeyNotFoundException($"File with ID {id} not found.");
        }

        // עדכון שדות רלוונטיים בלבד
        existingFile.FileName = updatedFile.FileName;
        existingFile.FileType = updatedFile.FileType;
        //existingFile.FilePath = updatedFile.FilePath; // אם הנתיב השתנה
        //existingFile.IsDeleted = updatedFile.IsDeleted;
        existingFile.UpdatedAt = DateTime.UtcNow; // עדכון זמן העריכה
        //existingFile.S3Key = updatedFile.S3Key; // במידה והקובץ הועלה מחדש
        //existingFile.Size = updatedFile.Size; // עדכון גודל קובץ במקרה של העלאה מחודשת

    }

    public async Task DeleteAsync(int id)
    {
        var file = await _context.Files.FindAsync(id);
        if (file != null)
        {
           file.IsDeleted = true;
        }
    }
 



}
