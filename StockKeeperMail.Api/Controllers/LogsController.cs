using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/logs")]
    public class LogsController : EntityControllerBase<Log>
    {
        public LogsController(GenericEntityService<Log> service) : base(service)
        {
        }
    }
}
