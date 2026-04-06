using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с размещением товаров по локациям.
    /// </summary>
    [Route("api/product-locations")]
    public class ProductLocationsController : EntityControllerBase<ProductLocation>
    {
        /// <summary>
        /// Инициализирует контроллер размещения товаров.
        /// </summary>
        public ProductLocationsController(GenericEntityService<ProductLocation> service) : base(service)
        {
        }
    }
}
