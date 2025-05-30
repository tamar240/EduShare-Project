﻿using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static System.Net.Mime.MediaTypeNames;

[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;
    private readonly S3Service _s3Service;

    public UploadController(IAmazonS3 s3Client, S3Service s3Service)
    {
        _s3Client = s3Client;
        _s3Service = s3Service;
    }

    [HttpGet("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string contentType)
    {
        if (string.IsNullOrEmpty(fileName))
            return BadRequest("File name is required.");

        if (string.IsNullOrEmpty(contentType))
            return BadRequest("Content-Type is required.");

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);


        var request = new GetPreSignedUrlRequest
        {
            BucketName = "edushare-files",
            Key = $"{userId}/{fileName}",
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(200),
            ContentType = contentType // קבלת ה-Content-Type מהמשתמש
        };

        try
        {
            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }
        catch (AmazonS3Exception ex)
        {
            Console.WriteLine($"S3 Exception: {ex.Message}\n{ex.StackTrace}");

            return StatusCode(500, $"Error generating presigned URL: {ex.Message}");
        }
    }



    [HttpPost("download-url")]
    public async Task<IActionResult> GetDownloadUrlFromBody([FromBody] string fileKey)
    {
        var userId = User.FindFirst("id")?.Value ?? "0";

        var url = await _s3Service.GetDownloadUrlAsync(userId, fileKey);
        return Ok(new { downloadUrl = url });
    }


    [HttpGet("presigned-url/view")]
    public async Task<IActionResult> GetPresignedUrlForViewing([FromQuery] string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            return BadRequest("File path is required.");

        var decodedKey = Uri.UnescapeDataString(filePath);

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "edushare-files",
            Key = decodedKey,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddMinutes(15),
            ResponseHeaderOverrides =
        {
            ContentDisposition = "inline" // זה מה שגורם לצפייה
        }
        };

        try
        {
            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }
        catch (AmazonS3Exception ex)
        {
            return StatusCode(500, $"Error generating presigned URL: {ex.Message}");
        }
    }

    [HttpDelete("{key}")]
    public async Task<IActionResult> DeleteFile(string key)
    {
        var result = await _s3Service.DeleteFileAsync(key);
        if (result)
            return NoContent(); 
        return BadRequest("Failed to delete file from S3.");
    }

}
