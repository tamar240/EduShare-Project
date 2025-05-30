using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace EduShare.Service
{
    
    using EduShare.Core.Models;
    using EduShare.Core.Services;
    using Microsoft.Extensions.Logging;
    using System.Text;
    using System.Text.Json;

    public class AIProcessingService : IAIProcessingService
    {
        private readonly IFileService _fileService;
        private readonly HttpClient _httpClient;
        //private readonly ILogger<AIProcessingService> _logger;
        //[HttpPost]
        //public async Task<IActionResult> AddLesson([FromBody] LessonWithFileDTO data)
        //{
        //    var lessonDTO = data.LessonDTO;
        //    var fileDTO = data.FileDTO;

        //    if (lessonDTO == null || fileDTO == null)
        //        return BadRequest("Invalid data.");

        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        //    var token = await HttpContext.GetTokenAsync("access_token"); // שליפת הטוקן

        //    var lesson = _mapper.Map<Lesson>(lessonDTO);
        //    lesson.OwnerId = userId;
        //    var newLesson = await _lessonService.AddLessonAsync(lesson, userId);

        //    var file = _mapper.Map<UploadedFile>(fileDTO);
        //    file.LessonId = newLesson.Id;
        //    var addedFile = await _fileService.AddFileAsync(file, userId);

        //    newLesson.OrginalSummary = addedFile;
        //    newLesson.OrginalSummaryId = addedFile.Id;

        //    // הדפסת ה-URL לפני שליחה
        //    Console.WriteLine($"File URL sent to Python: {addedFile.FilePath}");

        //    if (!Uri.IsWellFormedUriString(addedFile.FilePath, UriKind.Absolute))
        //    {
        //        Console.WriteLine($"Warning: FilePath '{addedFile.FilePath}' does not appear to be a valid URL.");
        //    }

        //    try
        //    {

        //        using var httpClient = new HttpClient();
        //        var requestPayload = new
        //        {
        //            file_url = addedFile.FilePath,
        //            lesson_id = newLesson.Id.ToString()// כאן את שולחת גם את ה-ID של השיעור
        //        };
        //        var json = JsonSerializer.Serialize(requestPayload);
        //        var content = new StringContent(json, Encoding.UTF8, "application/json");

        //        var pythonApiUrl = "http://127.0.0.1:8000/process-file";

        //        // הוספת הטוקן ל-Authorization Header
        //        if (!string.IsNullOrEmpty(token))
        //        {
        //            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        //        }

        //        var response = await httpClient.PostAsync(pythonApiUrl, content);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            var responseString = await response.Content.ReadAsStringAsync();

        //            var jsonDoc = JsonDocument.Parse(responseString);
        //            var root = jsonDoc.RootElement;

        //            var fileKey = root.GetProperty("fileKey").GetString(); // כאן אתה מקבל את ה-Key
        //            var fileName = root.GetProperty("file_name").GetString();
        //            var viewUrl = root.GetProperty("viewUrl").GetString();

        //            var pdfStream = await response.Content.ReadAsStreamAsync();
        //            using var memoryStream = new MemoryStream();
        //            await pdfStream.CopyToAsync(memoryStream);



        //            // יצירת קובץ חדש בבסיס הנתונים בלבד
        //            var processedFile = new UploadedFile
        //            {
        //                FileName = $"lessonId_{newLesson.Id}_summary",
        //                FileType = "pdf",
        //                FilePath = fileKey,
        //                S3Key = fileKey,
        //                LessonId = newLesson.Id,
        //                OwnerId = userId,
        //                Size = memoryStream.Length,
        //                UploadedAt = DateTime.Now,
        //                UpdatedAt = DateTime.Now,
        //                IsDeleted = false,
        //                //Content = memoryStream.ToArray() // נוסיף את הקובץ עצמו לתוך השדה DB אם תרצה
        //            };

        //            var addedProcessedFile = await _fileService.AddFileAsync(processedFile, userId);

        //            newLesson.ProcessedSummary = addedProcessedFile;
        //            newLesson.ProcessedSummaryId = addedProcessedFile.Id;

        //            await _lessonService.UpdateAsync(lesson.Id, newLesson, userId);
        //        }
        //        else
        //        {
        //            Console.WriteLine($"AI API call failed: {response.StatusCode}");
        //            var errorContent = await response.Content.ReadAsStringAsync();
        //            Console.WriteLine($"Python Error Content: {errorContent}");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error calling AI service: {ex.Message}");
        //    }

        //    return Ok();
        //}
        public AIProcessingService(IFileService fileService, HttpClient httpClient, ILogger<AIProcessingService> logger)
        {
            _fileService = fileService;
            _httpClient = httpClient;
            //_logger = logger;
        }
        private string GenerateSignature(string input)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(input);
                var hash = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
        public async Task<UploadedFile?> ProcessLessonSummaryAsync(UploadedFile originalFile, int lessonId, int userId, string accessToken)
        {
            var payload = new
            {
                file_url = originalFile.FilePath,
                lesson_id = lessonId.ToString()
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            if (!string.IsNullOrEmpty(accessToken))
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            }
            //        
            var response = await _httpClient.PostAsync("https://edushare-project.onrender.com/process-file", content);


            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(responseString);
            var root = jsonDoc.RootElement;

            var fileKey = root.GetProperty("fileKey").GetString();
            var size = root.GetProperty("size").GetInt64();
            var signature = GenerateSignature(fileKey);

            var processedFile = new UploadedFile
            {
                FileName = $"lessonId_{lessonId}_summary.pdf",
                FileType = "application/pdf",
                FilePath = signature,
                S3Key = $"{userId}/lessonId_{lessonId}_summary.pdf",
                LessonId = lessonId,
                OwnerId = userId,
                Size = size,
                UploadedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            return await _fileService.AddFileAsync(processedFile, userId);
        }

        //public async Task<UploadedFile?> ProcessLessonSummaryAsync(UploadedFile originalFile, int lessonId, int userId, string accessToken)
        //{
        //    //if (!Uri.IsWellFormedUriString(originalFile.FilePath, UriKind.Absolute))
        //    //{
        //    //    _logger.LogWarning($"FilePath '{originalFile.FilePath}' is not a valid URL.");
        //    //    return null;
        //    //}

        //    try
        //    {
        //        var payload = new
        //        {
        //            file_url = originalFile.FilePath,
        //            lesson_id = lessonId.ToString()
        //        };

        //        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        //        if (!string.IsNullOrEmpty(accessToken))
        //        {
        //            _httpClient.DefaultRequestHeaders.Authorization =
        //                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
        //        }

        //        var response = await _httpClient.PostAsync("http://127.0.0.1:8000/process-file", content);

        //        if (!response.IsSuccessStatusCode)
        //        {
        //            _logger.LogError($"AI API failed with status: {response.StatusCode}");
        //            var errorContent = await response.Content.ReadAsStringAsync();
        //            _logger.LogError($"Error: {errorContent}");
        //            return null;
        //        }

        //        var responseBody = await response.Content.ReadAsStringAsync();
        //        var jsonDoc = JsonDocument.Parse(responseBody);
        //        var root = jsonDoc.RootElement;

        //        var fileKey = root.GetProperty("fileKey").GetString();
        //        var fileName = root.GetProperty("file_name").GetString();
        //        var viewUrl = root.GetProperty("viewUrl").GetString();

        //        var pdfStream = await response.Content.ReadAsStreamAsync();
        //        using var memoryStream = new MemoryStream();
        //        await pdfStream.CopyToAsync(memoryStream);

        //        var processedFile = new UploadedFile
        //        {
        //            FileName = $"lessonId_{lessonId}_summary",
        //            FileType = "pdf",
        //            FilePath = fileKey,
        //            S3Key = fileKey,
        //            LessonId = lessonId,
        //            OwnerId = userId,
        //            Size = memoryStream.Length,
        //            UploadedAt = DateTime.Now,
        //            UpdatedAt = DateTime.Now,
        //            IsDeleted = false
        //        };

        //        return await _fileService.AddFileAsync(processedFile, userId);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine("Exception during AI file processing");
        //        _logger.LogError(ex, "Exception during AI file processing");
        //        return null;
        //    }
        //}
    }

}
