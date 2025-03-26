using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UploadedFile, UploadedFileDTO>().ReverseMap();
            CreateMap<UploadedFile, UploadedFilePostDTO>().ReverseMap();
            CreateMap<UserDTO, User>().ReverseMap();
            CreateMap<UserDTO, UserPostDTO>().ReverseMap();
            CreateMap<UserDTO, RegisterModel>().ReverseMap();
            CreateMap<LessonDTO, Lesson>().ReverseMap();
            CreateMap<LessonGetDTO, Lesson>().ReverseMap();
            CreateMap<Subject, SubjectDTO>().ReverseMap();
            CreateMap<Subject, SubjectGetDTO>().ReverseMap();

            //CreateMap<InstitutionDTO, Institution>().ReverseMap();
        }
    }
}
