using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderAggregateService _service;

        public OrdersController(OrderAggregateService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> Get()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Order order)
        {
            await _service.InsertAsync(order);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Order order)
        {
            await _service.UpdateAsync(order);
            return Ok();
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] Order order)
        {
            await _service.DeleteAsync(order);
            return Ok();
        }
    }
}
