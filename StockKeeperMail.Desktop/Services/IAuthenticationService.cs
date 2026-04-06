using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.Services
{
    /// <summary>
    /// Представляет интерфейс IAuthenticationService.
    /// </summary>
    interface IAuthenticationService
    {
        public Staff Login(string username, string password);
    }
}
