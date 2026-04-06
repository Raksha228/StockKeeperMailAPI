using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/categories")]
    public class CategoriesController : EntityControllerBase<Category>
    {
        public CategoriesController(GenericEntityService<Category> service) : base(service)
        {
        }
    }
}
