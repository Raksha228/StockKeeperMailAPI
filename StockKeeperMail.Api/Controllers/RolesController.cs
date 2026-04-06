using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/roles")]
    public class RolesController : EntityControllerBase<Role>
    {
        public RolesController(GenericEntityService<Role> service) : base(service)
        {
        }
    }
}
