using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с поставщиками.
    /// </summary>
    [Route("api/suppliers")]
    public class SuppliersController : EntityControllerBase<Supplier>
    {
        /// <summary>
        /// Инициализирует контроллер поставщиков.
        /// </summary>
        public SuppliersController(GenericEntityService<Supplier> service) : base(service)
        {
        }
    }
}
