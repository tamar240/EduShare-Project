using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using Microsoft.EntityFrameworkCore;


namespace EduShare.Data.Repositories
{
    public class InstitutionRepository : IInstitutionRepository
    {
        private readonly DataContext _context;

        public InstitutionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Institution>> GetAllInstitutionsAsync()
        {
            return await _context.Institutions.ToListAsync();
        }

        public async Task<Institution> GetInstitutionByIdAsync(int id)
        {
            return await _context.Institutions.FindAsync(id);
        }

        public async Task<Institution> GetInstitutionByNameAsync(string name)
        {
            return await _context.Institutions.FirstOrDefaultAsync(i => i.Name == name);
        }

        public async Task AddInstitutionAsync(Institution institution)
        {
            await _context.Institutions.AddAsync(institution);
        }

        public async Task UpdateInstitutionAsync(int id, Institution institution)
        {
            var existingInstitution = await _context.Institutions.FindAsync(id);
            if (existingInstitution != null)
            {
                existingInstitution.Name = institution.Name;
                existingInstitution.Code = institution.Code; 
            }
        }

        public async Task DeleteInstitutionAsync(int id)
        {
            var institution = await _context.Institutions.FindAsync(id);
            if (institution != null)
            {
                _context.Institutions.Remove(institution);
            }
        }
    }
}
