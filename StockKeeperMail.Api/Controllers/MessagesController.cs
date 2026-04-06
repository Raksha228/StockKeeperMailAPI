using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/messages")]
    public class MessagesController : EntityControllerBase<InternalMessage>
    {
        public MessagesController(GenericEntityService<InternalMessage> service) : base(service)
        {
        }
    }
}
