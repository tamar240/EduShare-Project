using Amazon.Runtime;
using Amazon.S3;
using EduShare.Core.Mappings;
using EduShare.Core.Repositories;
using EduShare.Core.Services;
using EduShare.Data;
using EduShare.Data.Repositories;
using EduShare.Data.Services;
using EduShare.Infrastructure.Repositories;
using EduShare.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();




builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IRoleRepository, RoleRepository>();


builder.Services.AddScoped<IUserRolesRepository, UserRolesRepository>();

// הזרקות לשירותים (Services)

builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<ISubjectService, SubjectService>();


// הזרקות לרפוזיטוריות (Repositories)
builder.Services.AddScoped<IFileRepository, FileRepository>();

builder.Services.AddScoped<ILessonRepository, LessonRepository>();
builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();

builder.Services.AddScoped<IManagerRepository, ManagerRepository>();

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<S3Service>();
builder.Services.AddScoped<LessonRepository>();

builder.Services.AddHttpContextAccessor();//???

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

builder.Services.AddHttpContextAccessor();///delete?

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// הוספת הרשאות מבוססות-תפקידים
builder.Services.AddAuthorization(options =>

{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("TeacherOnly", policy => policy.RequireRole("Teacher"));
});
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin() // מתיר גישה מכל דומיין
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION");

var credentials = new BasicAWSCredentials(
builder.Configuration["AWS:AccessKey"],
builder.Configuration["AWS:SecretKey"]
//AccessKey,
//SecretAccess
);

var region = Amazon.RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"]);
//var region = Amazon.RegionEndpoint.GetBySystemName(awsRegion);

var s3Client = new AmazonS3Client(credentials, region);

builder.Services.AddSingleton<IAmazonS3>(s3Client);
Console.WriteLine(s3Client);

var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("_myAllowSpecificOrigins");
app.UseHttpsRedirection();

app.UseAuthentication();//JWT

app.UseAuthorization();

app.MapControllers();

app.Run();
