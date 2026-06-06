using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с приходом товара от поставщиков.
    /// </summary>
    [Route("api/purchase-receipts")]
    public class PurchaseReceiptsController : EntityControllerBase<PurchaseReceipt>
    {
        /// <summary>
        /// Инициализирует контроллер прихода товара.
        /// </summary>
        public PurchaseReceiptsController(GenericEntityService<PurchaseReceipt> service) : base(service)
        {
        }
    }
}
