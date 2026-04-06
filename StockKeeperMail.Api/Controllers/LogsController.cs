using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с журналом действий.
    /// </summary>
    [Route("api/logs")]
    public class LogsController : EntityControllerBase<Log>
    {
        /// <summary>
        /// Инициализирует контроллер журнала действий.
        /// </summary>
        public LogsController(GenericEntityService<Log> service) : base(service)
        {
        }
    }
}
