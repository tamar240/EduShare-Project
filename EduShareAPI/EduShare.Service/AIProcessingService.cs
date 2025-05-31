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
     
        public AIProcessingService(IFileService fileService, HttpClient httpClient, ILogger<AIProcessingService> logger)
        {
            _fileService = fileService;
            _httpClient = httpClient;
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

      
    }

}
