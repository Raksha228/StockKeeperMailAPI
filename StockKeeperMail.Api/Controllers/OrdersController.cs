using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с заказами как агрегатами вместе со строками заказа.
    /// </summary>
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderAggregateService _service;

        /// <summary>
        /// Инициализирует контроллер заказов.
        /// </summary>
        public OrdersController(OrderAggregateService service)
        {
            _service = service;
        }

        /// <summary>
        /// Возвращает список заказов вместе со связанными данными.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> Get()
        {
            return Ok(await _service.GetAllAsync());
        }

        /// <summary>
        /// Создаёт новый заказ вместе со строками заказа.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Order order)
        {
            await _service.InsertAsync(order);
            return Ok();
        }

        /// <summary>
        /// Обновляет заказ и связанные строки заказа.
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Order order)
        {
            await _service.UpdateAsync(order);
            return Ok();
        }

        /// <summary>
        /// Удаляет заказ и связанные строки заказа.
        /// </summary>
        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] Order order)
        {
            await _service.DeleteAsync(order);
            return Ok();
        }
    }
}
