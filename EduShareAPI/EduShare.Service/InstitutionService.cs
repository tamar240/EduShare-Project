using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduShare.Service
{
    public class InstitutionService : IInstitutionService
    {
        private readonly IManagerRepository _managerRepository;

        public InstitutionService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<List<Institution>> GetAllInstitutions()
        {
            return await _managerRepository.Institutions.GetAllInstitutionsAsync();
        }

        public async Task<Institution> GetInstitutionById(int id)
        {
            return await _managerRepository.Institutions.GetInstitutionByIdAsync(id);
        }

        public async Task<Institution> GetInstitutionByName(string name)
        {
            return await _managerRepository.Institutions.GetInstitutionByNameAsync(name);
        }

        public async Task AddInstitution(Institution institution)
        {
            await _managerRepository.Institutions.AddInstitutionAsync(institution);
            await _managerRepository.SaveAsync();
        }

        public async Task UpdateInstitution(int id, Institution institution)
        {
            await _managerRepository.Institutions.UpdateInstitutionAsync(id, institution);
            await _managerRepository.SaveAsync();
        }

        public async Task DeleteInstitution(int id)
        {
            await _managerRepository.Institutions.DeleteInstitutionAsync(id);
            await _managerRepository.SaveAsync();
        }
    }
}
