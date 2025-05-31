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
builder.Services.AddSingleton<IAmazonS3>(provider =>
{
    var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
    var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");
    var region = Environment.GetEnvironmentVariable("AWS_REGION") ?? "eu-north-1";

    return new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.EUNorth1);
});
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



builder.Services.AddHttpClient<AIProcessingService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IRoleRepository, RoleRepository>();


builder.Services.AddScoped<IUserRolesRepository, UserRolesRepository>();


builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<ISubjectService, SubjectService>();


builder.Services.AddScoped<IFileRepository, FileRepository>();

builder.Services.AddScoped<ILessonRepository, LessonRepository>();
builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();

builder.Services.AddScoped<IManagerRepository, ManagerRepository>();

builder.Services.AddHttpClient<IAIProcessingService, AIProcessingService>();


builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<S3Service>();
builder.Services.AddScoped<LessonRepository>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);


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

                          policy.WithOrigins(
                             "https://edushare-er29.onrender.com",
                             "http://localhost:5173" ,
                             "https://edushare-admin.onrender.com"
                          )
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();

                      });
});


builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();


app.UseCors(MyAllowSpecificOrigins); 


app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
