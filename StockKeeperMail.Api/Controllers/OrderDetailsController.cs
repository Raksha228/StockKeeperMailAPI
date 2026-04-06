using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы со строками заказов.
    /// </summary>
    [Route("api/order-details")]
    public class OrderDetailsController : EntityControllerBase<OrderDetail>
    {
        /// <summary>
        /// Инициализирует контроллер строк заказов.
        /// </summary>
        public OrderDetailsController(GenericEntityService<OrderDetail> service) : base(service)
        {
        }
    }
}
