using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        private readonly ILogger<AIProcessingService> _logger;

        public AIProcessingService(IFileService fileService, HttpClient httpClient, ILogger<AIProcessingService> logger)
        {
            _fileService = fileService;
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<UploadedFile?> ProcessLessonSummaryAsync(UploadedFile originalFile, int lessonId, int userId, string accessToken)
        {
            //if (!Uri.IsWellFormedUriString(originalFile.FilePath, UriKind.Absolute))
            //{
            //    _logger.LogWarning($"FilePath '{originalFile.FilePath}' is not a valid URL.");
            //    return null;
            //}

            try
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

                var response = await _httpClient.PostAsync("http://127.0.0.1:8000/process-file", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"AI API failed with status: {response.StatusCode}");
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Error: {errorContent}");
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                var jsonDoc = JsonDocument.Parse(responseBody);
                var root = jsonDoc.RootElement;

                var fileKey = root.GetProperty("fileKey").GetString();
                var fileName = root.GetProperty("file_name").GetString();
                var viewUrl = root.GetProperty("viewUrl").GetString();

                var pdfStream = await response.Content.ReadAsStreamAsync();
                using var memoryStream = new MemoryStream();
                await pdfStream.CopyToAsync(memoryStream);

                var processedFile = new UploadedFile
                {
                    FileName = $"lessonId_{lessonId}_summary",
                    FileType = "pdf",
                    FilePath = fileKey,
                    S3Key = fileKey,
                    LessonId = lessonId,
                    OwnerId = userId,
                    Size = memoryStream.Length,
                    UploadedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    IsDeleted = false
                };

                return await _fileService.AddFileAsync(processedFile, userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception during AI file processing");
                _logger.LogError(ex, "Exception during AI file processing");
                return null;
            }
        }
    }

}
