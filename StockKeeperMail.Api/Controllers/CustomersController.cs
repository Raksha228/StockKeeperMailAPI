using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с клиентами.
    /// </summary>
    [Route("api/customers")]
    public class CustomersController : EntityControllerBase<Customer>
    {
        /// <summary>
        /// Инициализирует контроллер клиентов.
        /// </summary>
        public CustomersController(GenericEntityService<Customer> service) : base(service)
        {
        }
    }
}
