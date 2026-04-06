using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с локациями хранения.
    /// </summary>
    [Route("api/locations")]
    public class LocationsController : EntityControllerBase<Location>
    {
        /// <summary>
        /// Инициализирует контроллер локаций.
        /// </summary>
        public LocationsController(GenericEntityService<Location> service) : base(service)
        {
        }
    }
}
