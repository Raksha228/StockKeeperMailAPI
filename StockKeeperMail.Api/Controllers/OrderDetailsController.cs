using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/order-details")]
    public class OrderDetailsController : EntityControllerBase<OrderDetail>
    {
        public OrderDetailsController(GenericEntityService<OrderDetail> service) : base(service)
        {
        }
    }
}
