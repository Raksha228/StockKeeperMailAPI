using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с сотрудниками.
    /// </summary>
    [Route("api/staff")]
    public class StaffController : EntityControllerBase<Staff>
    {
        /// <summary>
        /// Инициализирует контроллер сотрудников.
        /// </summary>
        public StaffController(GenericEntityService<Staff> service) : base(service)
        {
        }
    }
}
