using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Data;
using System;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Контроллер для проверки доступности API и MongoDB.
    /// </summary>
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        private readonly MongoDatabaseProvider _databaseProvider;

        public HealthController(MongoDatabaseProvider databaseProvider)
        {
            _databaseProvider = databaseProvider;
        }

        /// <summary>
        /// Возвращает признак доступности API и реального подключения к MongoDB.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                await _databaseProvider.PingAsync();

                return Ok(new
                {
                    status = "ok",
                    api = "ok",
                    database = "ok",
                    databaseName = _databaseProvider.DatabaseName
                });
            }
            catch (Exception exception)
            {
                return StatusCode(503, new
                {
                    status = "error",
                    api = "ok",
                    database = "error",
                    databaseName = _databaseProvider.DatabaseName,
                    message = exception.Message
                });
            }
        }
    }
}
