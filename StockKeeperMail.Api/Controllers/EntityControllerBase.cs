using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Базовый контроллер для типовых CRUD-операций.
    /// </summary>
    [ApiController]
    public abstract class EntityControllerBase<TEntity> : ControllerBase where TEntity : class
    {
        private readonly GenericEntityService<TEntity> _service;

        protected EntityControllerBase(GenericEntityService<TEntity> service)
        {
            _service = service;
        }

        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<TEntity>>> Get()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] TEntity entity)
        {
            await _service.InsertAsync(entity);
            return Ok();
        }

        [HttpPut]
        public virtual async Task<IActionResult> Put([FromBody] TEntity entity)
        {
            await _service.UpdateAsync(entity);
            return Ok();
        }

        [HttpPost("delete")]
        public virtual async Task<IActionResult> Delete([FromBody] TEntity entity)
        {
            await _service.DeleteAsync(entity);
            return Ok();
        }
    }
}
