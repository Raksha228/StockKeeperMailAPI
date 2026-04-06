using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/staff")]
    public class StaffController : EntityControllerBase<Staff>
    {
        public StaffController(GenericEntityService<Staff> service) : base(service)
        {
        }
    }
}
