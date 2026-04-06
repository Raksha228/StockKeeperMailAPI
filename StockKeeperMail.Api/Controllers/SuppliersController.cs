using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/suppliers")]
    public class SuppliersController : EntityControllerBase<Supplier>
    {
        public SuppliersController(GenericEntityService<Supplier> service) : base(service)
        {
        }
    }
}
