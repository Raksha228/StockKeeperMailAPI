using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/customers")]
    public class CustomersController : EntityControllerBase<Customer>
    {
        public CustomersController(GenericEntityService<Customer> service) : base(service)
        {
        }
    }
}
