using Microsoft.AspNetCore.Mvc;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для проверки доступности API.
    /// </summary>
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        /// <summary>
        /// Возвращает признак доступности API.
        /// </summary>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "ok" });
        }
    }
}
