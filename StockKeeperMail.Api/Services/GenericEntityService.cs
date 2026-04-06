using StockKeeperMail.Api.Data;
using StockKeeperMail.Database.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Services
{
    /// <summary>
    /// Сервис CRUD-операций для обычных сущностей.
    /// </summary>
    public class GenericEntityService<TEntity> where TEntity : class
    {
        private readonly MongoRepository<TEntity> _repository;
        private readonly EntityHydrationService _hydrationService;

        /// <summary>
        /// Инициализирует сервис типовых операций с сущностью.
        /// </summary>
        public GenericEntityService(MongoRepository<TEntity> repository, EntityHydrationService hydrationService)
        {
            _repository = repository;
            _hydrationService = hydrationService;
        }

        /// <summary>
        /// Возвращает все сущности с заполненными связанными данными.
        /// </summary>
        public async Task<List<TEntity>> GetAllAsync()
        {
            List<TEntity> rawItems = await _repository.GetAllAsync();
            return await _hydrationService.HydrateAsync(rawItems);
        }

        /// <summary>
        /// Создаёт новую сущность.
        /// </summary>
        public Task InsertAsync(TEntity entity)
        {
            return _repository.InsertAsync(entity);
        }

        /// <summary>
        /// Обновляет существующую сущность.
        /// </summary>
        public Task UpdateAsync(TEntity entity)
        {
            return _repository.ReplaceAsync(entity);
        }

        /// <summary>
        /// Удаляет существующую сущность.
        /// </summary>
        public Task DeleteAsync(TEntity entity)
        {
            return _repository.DeleteAsync(entity);
        }
    }
}
