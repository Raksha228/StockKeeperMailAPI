using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для работы с бракованными товарами.
    /// </summary>
    [Route("api/defectives")]
    public class DefectivesController : EntityControllerBase<Defective>
    {
        /// <summary>
        /// Инициализирует контроллер брака.
        /// </summary>
        public DefectivesController(GenericEntityService<Defective> service) : base(service)
        {
        }
    }
}
