﻿using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

public class S3Service
{
    private readonly string bucketName;
    private readonly IAmazonS3 s3Client;

    public S3Service(IConfiguration config, IAmazonS3 s3Client)
    {
        bucketName = config["AWS:BucketName"];
        this.s3Client = s3Client;

    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName,string contentType,int userId)
    {
        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = $"{userId}/{fileName}",
            InputStream = fileStream,
            ContentType = contentType,

            CannedACL = S3CannedACL.Private
        };

        await s3Client.PutObjectAsync(request);
        return $"https://{bucketName}.s3.amazonaws.com/{fileName}";
    }

    public async Task<string> GetDownloadUrlAsync(string userId, string fileKey)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = "edushare-files",
            Key = fileKey,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddDays(7),
        };

        return await s3Client.GetPreSignedURLAsync(request);
    }
    public async Task<bool> DeleteFileAsync(string key)
    {
        try
        {
            var request = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = key
            };

            var response = await s3Client.DeleteObjectAsync(request);

            return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
        }
        catch (AmazonS3Exception ex)
        {
            Console.WriteLine($"AWS S3 Error: {ex.Message}");
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"General Error: {ex.Message}");
            return false;
        }
    }

}
