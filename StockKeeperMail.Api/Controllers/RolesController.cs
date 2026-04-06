using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с ролями сотрудников.
    /// </summary>
    [Route("api/roles")]
    public class RolesController : EntityControllerBase<Role>
    {
        /// <summary>
        /// Инициализирует контроллер ролей.
        /// </summary>
        public RolesController(GenericEntityService<Role> service) : base(service)
        {
        }
    }
}
