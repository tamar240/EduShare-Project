using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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

            var subjectResult = await _subjectService.AddSubjectAsync(subject);
            return Ok(subjectResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            var subjects = await _subjectService.GetAllSubjectsAsync();
            return Ok(_mapper.Map<List<SubjectGetDTO>>(subjects));
        }
        [HttpGet("user")]
        public async Task<IActionResult> GetUserSubjects()
        {
            var subjects = await _subjectService.GetAllMyAsync();
            return Ok(_mapper.Map<List<SubjectGetDTO>>(subjects));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubjectById(int id)
        {
            var subject = await _subjectService.GetSubjectByIdAsync(id);
            if (subject == null)
                return NotFound($"Subject with ID {id} not found.");

            return Ok(_mapper.Map<SubjectGetDTO>(subject));
        }


        [HttpGet("public")]
        public async Task<IActionResult> GetPublicSubjects()
        {
            var subjects = await _subjectService.GetPublicSubjectsAsync();
            return Ok(_mapper.Map<List<SubjectGetDTO>>(subjects));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(int id, [FromBody] SubjectDTO subjectDTO)
        {
            if (subjectDTO == null)
                return BadRequest("Invalid subject data.");

            var subject = _mapper.Map<Subject>(subjectDTO);

            await _subjectService.UpdateSubjectAsync(id, subject);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            await _subjectService.DeleteSubjectAsync(id);
            return NoContent();
        }





        //[HttpGet("{id}/lessons")]
        //public async Task<IActionResult> GetLessonsBySubject(int id)
        //{
        //    var subject = await _subjectService.GetSubjectByIdAsync(id);
        //    if (subject == null)
        //        return NotFound($"Subject with ID {id} not found.");

        //    var lessons = await _subjectService.GetLessonsBySubjectAsync(id);
        //    return Ok(new
        //    {
        //        subject,
        //        lessons
        //    });
        //}
    }
}
