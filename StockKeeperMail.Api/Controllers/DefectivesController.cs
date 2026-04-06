using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Controllers
{
    [Route("api/defectives")]
    public class DefectivesController : EntityControllerBase<Defective>
    {
        public DefectivesController(GenericEntityService<Defective> service) : base(service)
        {
        }
    }
}
