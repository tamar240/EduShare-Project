using EduShare.Core.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace EduShare.Core.Entities
{
    public class User
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        [EmailAddress]
        public string Email { get; set; }

        //public UserRoleEnum Role { get; set; }
        //= UserRoleEnum.Teacher; // ברירת מחדל - מורה

        //public string? InstitutionCode { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        //public List<UploadedFile> UploadedFiles { get; set; } = new();

        public List<Subject> subjects = new();

        public bool IsDeleted { get; set; } = false;

    }
}
