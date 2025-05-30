﻿using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EduShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectService _subjectService;
        private readonly IMapper _mapper;
        public SubjectController(ISubjectService subjectService, IMapper mapper)
        {
            _subjectService = subjectService;
            _mapper = mapper;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddSubject([FromBody] SubjectDTO subjectDTO)
        {
         

            if (subjectDTO == null)
                return BadRequest("Invalid subject data.");

            var subject = _mapper.Map<Subject>(subjectDTO);
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);


            var subjectResult = await _subjectService.AddSubjectAsync(subject, userId);
            return Ok(subjectResult);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetSubjects()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var subjects = await _subjectService.GetAllSubjectsAsync(userId);
            return Ok(_mapper.Map<List<SubjectGetDTO>>(subjects));
        }

    

       

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubjectById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var subject = await _subjectService.GetSubjectByIdAsync(id, userId);
            if (subject == null)
                return NotFound($"Subject with ID {id} not found.");

            return Ok(_mapper.Map<SubjectGetDTO>(subject));
        }


        [HttpGet("public")]
        public async Task<IActionResult> GetPublicSubjects()
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var subjects = await _subjectService.GetPublicSubjectsAsync( userId);
            return Ok(_mapper.Map<List<SubjectGetDTO>>(subjects));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(int id, [FromBody] SubjectDTO subjectDTO)
        {
            if (subjectDTO == null)
                return BadRequest("Invalid subject data.");

            var subject = _mapper.Map<Subject>(subjectDTO); 
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);


            await _subjectService.UpdateSubjectAsync(id, subject,userId);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            await _subjectService.DeleteSubjectAsync(id, userId);
            return NoContent();
        }


    }
}
