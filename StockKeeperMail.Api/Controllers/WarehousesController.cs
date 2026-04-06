using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/warehouses")]
    public class WarehousesController : EntityControllerBase<Warehouse>
    {
        public WarehousesController(GenericEntityService<Warehouse> service) : base(service)
        {
        }
    }
}
