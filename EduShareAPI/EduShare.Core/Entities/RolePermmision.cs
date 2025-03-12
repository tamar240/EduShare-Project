﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Entities
{
    public class RolePermmision
    {
        [Key]
        public int Id { get; set; }
        public int PermissionId { get; set; }
        public Permissions Permission { get; set; }

        public int RoleId { get; set; }
        public Roles Role { get; set; }
    }
}
