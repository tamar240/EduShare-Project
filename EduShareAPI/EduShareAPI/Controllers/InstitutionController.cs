using EduShare.Core.Entities;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using EduShare.Core.EntitiesDTO;
using AutoMapper;

namespace EduShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstitutionController : ControllerBase
    {
        private readonly IInstitutionService _institutionService;
        private readonly IMapper _mapper;

        public InstitutionController(IInstitutionService institutionService , IMapper mapper)
        {
            _institutionService = institutionService;
            _mapper = mapper;
        }

        // פעולה לקבלת רשימת מוסדות
        [HttpGet]
        public async Task<ActionResult<List<Institution>>> GetAll()
        {
            var institutions = await _institutionService.GetAllInstitutions();
            return Ok(institutions);
        }

        // פעולה לקבלת מוסד לפי מזהה
        [HttpGet("{id}")]
        public async Task<ActionResult<Institution>> GetById(int id)
        {
            var institution = await _institutionService.GetInstitutionById(id);
            if (institution == null)
            {
                return NotFound(new { message = "Institution not found." });
            }
            return Ok(institution);
        }

        // פעולה לקבלת מוסד לפי שם
        [HttpGet("name/{name}")]
        public async Task<ActionResult<Institution>> GetByName(string name)
        {
            var institution = await _institutionService.GetInstitutionByName(name);
            if (institution == null)
            {
                return NotFound(new { message = "Institution not found." });
            }
            return Ok(institution);
        }


        [HttpGet("admin-only")]
        [Authorize(Policy = "AdminOnly")] // רק Admin יכול לגשת
        // פעולה להוספת מוסד
        [HttpPost]
        public async Task<ActionResult> AddInstitution([FromBody] InstitutionDTO institutionDTO)

        {
            var institution=_mapper.Map<Institution>(institutionDTO);
            await _institutionService.AddInstitution(institution);
            return CreatedAtAction(nameof(GetById), new { id = institution.Id }, institution);
        }

        // פעולה לעדכון מוסד
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateInstitution(int id, [FromBody] Institution institution)
        {
            var existingInstitution = await _institutionService.GetInstitutionById(id);
            if (existingInstitution == null)
            {
                return NotFound(new { message = "Institution not found." });
            }

            await _institutionService.UpdateInstitution(id, institution);
            return Ok(new { message = "Institution updated successfully." });
        }

        // פעולה למחיקת מוסד
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInstitution(int id)
        {
            var institution = await _institutionService.GetInstitutionById(id);
            if (institution == null)
            {
                return NotFound(new { message = "Institution not found." });
            }

            await _institutionService.DeleteInstitution(id);
            return Ok(new { message = "Institution deleted successfully." });
        }
    }
}
