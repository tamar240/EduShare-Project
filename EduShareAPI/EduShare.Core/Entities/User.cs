using EduShare.Core.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EduShare.Core.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        //public UserRoleEnum Role { get; set; }

        //= UserRoleEnum.Teacher; // ברירת מחדל - מורה
        public string?[] InstitutionCode { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<UploadedFile> UploadedFiles { get; set; } = new();

    }
}
