using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/locations")]
    public class LocationsController : EntityControllerBase<Location>
    {
        public LocationsController(GenericEntityService<Location> service) : base(service)
        {
        }
    }
}
