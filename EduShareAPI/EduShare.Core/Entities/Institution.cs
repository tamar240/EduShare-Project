using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EduShare.Core.Entities
{
    public class Institution
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; } // מזהה ייחודי
        public string Name { get; set; } // שם המוסד
        public string Code { get; set; } // קוד ייחודי (יכול להיות לפי משרד החינוך)

        // קשר למשתמשים ששייכים למוסד
        public List<User> Users { get; set; } = new();
    }
}
