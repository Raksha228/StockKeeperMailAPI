using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с категориями товаров.
    /// </summary>
    [Route("api/categories")]
    public class CategoriesController : EntityControllerBase<Category>
    {
        /// <summary>
        /// Инициализирует контроллер категорий.
        /// </summary>
        public CategoriesController(GenericEntityService<Category> service) : base(service)
        {
        }
    }
}
