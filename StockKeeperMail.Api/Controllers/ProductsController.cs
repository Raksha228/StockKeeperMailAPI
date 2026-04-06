using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с товарами.
    /// </summary>
    [Route("api/products")]
    public class ProductsController : EntityControllerBase<Product>
    {
        /// <summary>
        /// Инициализирует контроллер товаров.
        /// </summary>
        public ProductsController(GenericEntityService<Product> service) : base(service)
        {
        }
    }
}
