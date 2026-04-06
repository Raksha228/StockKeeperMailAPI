using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/products")]
    public class ProductsController : EntityControllerBase<Product>
    {
        public ProductsController(GenericEntityService<Product> service) : base(service)
        {
        }
    }
}
