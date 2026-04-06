using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с внутренними сообщениями.
    /// </summary>
    [Route("api/messages")]
    public class MessagesController : EntityControllerBase<InternalMessage>
    {
        /// <summary>
        /// Инициализирует контроллер внутренних сообщений.
        /// </summary>
        public MessagesController(GenericEntityService<InternalMessage> service) : base(service)
        {
        }
    }
}
