using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы со складами.
    /// </summary>
    [Route("api/warehouses")]
    public class WarehousesController : EntityControllerBase<Warehouse>
    {
        /// <summary>
        /// Инициализирует контроллер складов.
        /// </summary>
        public WarehousesController(GenericEntityService<Warehouse> service) : base(service)
        {
        }
    }
}
