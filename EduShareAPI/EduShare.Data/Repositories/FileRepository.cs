using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Data;
using EduShare.Data.Repositories;
using EduShare.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;

public class FileRepository : IFileRepository
{
    private readonly DataContext _context;
    private readonly ILessonRepository _lessonRepository;


    public FileRepository(DataContext context,ILessonRepository lessonRepository)
    {
        _context = context;
        _lessonRepository = lessonRepository;
    }

    public async Task<UploadedFile> AddAsync(UploadedFile file)
    {
       

        file.S3Key= $"{file.OwnerId}/{file.FileName}";
        _context.Files.Add(file);
        return file;
    }
    public async Task<UploadedFile> GetFileByIdAsync(int id,int userId)
    {
        var file = await _context.Files.FindAsync(id);
        if (file == null || file.IsDeleted)
        {
            throw new KeyNotFoundException($"File with ID {id} not found.");
        }

     
        return file;
    }
    public async Task<UploadedFile> GetDeletedFileByIdAsync(int id, int userId)
    {
        var file = await _context.Files.FindAsync(id);
        if (file == null || !file.IsDeleted)
        {
            throw new KeyNotFoundException($"File with ID {id} not found.");
        }

        if (file.OwnerId != userId)
        {
            throw new UnauthorizedAccessException("You do not have permission to access this file.");
        }

        return file;
    }
    public async Task<List<UploadedFile>> GetFilesByLessonIdAsync(int lessonId,int userId)
    {
        var lesson =await _lessonRepository.GetByIdAsync(lessonId,userId);
        return await _context.Files
            .Where(f => f.LessonId == lessonId  && f.Id! !=lesson.OrginalSummaryId && f.Id! != lesson.ProcessedSummaryId &&!f.IsDeleted) // מסנן רק קבצים ששייכים לשיעור
            .ToListAsync();
    }



    public async Task<List<UploadedFile>> GetAllByUserIdAsync(int id)//מיותר בעיקרון
    {
        return await _context.Files.Where(f => f.OwnerId == id && !f.IsDeleted).ToListAsync();
    }
    public async Task<List<UploadedFile>> GetAllFilesAsync()
    {
        return await _context.Files.ToListAsync();
    }

    public async Task UpdateAsync(int id, UploadedFile updatedFile)
    {
        var existingFile = await _context.Files.FindAsync(id);
        if (existingFile == null || existingFile.IsDeleted)
        {
            throw new KeyNotFoundException($"File with ID {id} not found.");
        }

        existingFile.FileName = updatedFile.FileName;
        existingFile.FileType = updatedFile.FileType;
        existingFile.FilePath = updatedFile.FilePath; 
        existingFile.UpdatedAt = DateTime.UtcNow; 
        existingFile.Size = updatedFile.Size;

    }

    public async Task DeleteAsync(int id)
    {
        var file = await _context.Files.FindAsync(id);
        if (file != null)
        {
           file.IsDeleted = true;
        }
    }
    public async Task<List<UploadedFile>> GetDeletedFilesByUserIdAsync(int userId)
    {
        return await (
            from file in _context.Files
            join lesson in _context.Lessons on file.LessonId equals lesson.Id
            join subject in _context.Subjects on lesson.SubjectId equals subject.Id
            where file.IsDeleted &&
                  file.OwnerId == userId &&
                  !lesson.IsDeleted &&
                  !subject.IsDeleted
            select file
        ).ToListAsync();
    }




    public async Task HardDeleteAsync(int id)
    {
        var file = await _context.Files.FindAsync(id);
        if (file != null)
        {
            _context.Files.Remove(file);
        }
    }

    public async Task RestoreAsync(int id)
    {
        var file = await _context.Files.FindAsync(id);
        if (file != null && file.IsDeleted)
        {
            file.IsDeleted = false;
        }
    }

}
