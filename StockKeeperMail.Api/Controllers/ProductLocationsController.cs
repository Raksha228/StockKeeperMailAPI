using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/product-locations")]
    public class ProductLocationsController : EntityControllerBase<ProductLocation>
    {
        public ProductLocationsController(GenericEntityService<ProductLocation> service) : base(service)
        {
        }
    }
}
