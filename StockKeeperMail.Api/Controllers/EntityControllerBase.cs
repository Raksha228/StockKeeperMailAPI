using Microsoft.AspNetCore.Mvc;
using StockKeeperMail.Api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Controllers
{
    /// <summary>
    /// Базовый контроллер для типовых CRUD-операций над сущностями.
    /// </summary>
    [ApiController]
    public abstract class EntityControllerBase<TEntity> : ControllerBase where TEntity : class
    {
        private readonly GenericEntityService<TEntity> _service;

        /// <summary>
        /// Инициализирует базовый CRUD-контроллер.
        /// </summary>
        protected EntityControllerBase(GenericEntityService<TEntity> service)
        {
            _service = service;
        }

        /// <summary>
        /// Возвращает список сущностей текущего типа.
        /// </summary>
        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<TEntity>>> Get()
        {
            return Ok(await _service.GetAllAsync());
        }

        /// <summary>
        /// Создаёт новую сущность.
        /// </summary>
        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] TEntity entity)
        {
            await _service.InsertAsync(entity);
            return Ok();
        }

        /// <summary>
        /// Обновляет существующую сущность.
        /// </summary>
        [HttpPut]
        public virtual async Task<IActionResult> Put([FromBody] TEntity entity)
        {
            await _service.UpdateAsync(entity);
            return Ok();
        }

        /// <summary>
        /// Удаляет переданную сущность.
        /// </summary>
        [HttpPost("delete")]
        public virtual async Task<IActionResult> Delete([FromBody] TEntity entity)
        {
            await _service.DeleteAsync(entity);
            return Ok();
        }
    }
}
