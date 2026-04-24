using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.Services
{

    /// <summary>
    /// Представляет класс AuthenticationService.
    /// </summary>
    public class AuthenticationService : IAuthenticationService
    {
        private Staff _staff;
        public Staff Staff => _staff;


        private readonly IUnitOfWork _unitOfWork;

        public AuthenticationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public Staff Login(string username, string password)
        {
            Staff storedStaff = _unitOfWork.StaffRepository.Get(s => s.StaffUsername == username && s.StaffPassword == password).SingleOrDefault();

            _staff = storedStaff;
            return storedStaff;
        }

    }

}
