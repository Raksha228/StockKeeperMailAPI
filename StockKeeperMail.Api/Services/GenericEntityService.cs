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

        public GenericEntityService(MongoRepository<TEntity> repository, EntityHydrationService hydrationService)
        {
            _repository = repository;
            _hydrationService = hydrationService;
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            List<TEntity> rawItems = await _repository.GetAllAsync();
            return await _hydrationService.HydrateAsync(rawItems);
        }

        public Task InsertAsync(TEntity entity)
        {
            return _repository.InsertAsync(entity);
        }

        public Task UpdateAsync(TEntity entity)
        {
            return _repository.ReplaceAsync(entity);
        }

        public Task DeleteAsync(TEntity entity)
        {
            return _repository.DeleteAsync(entity);
        }
    }
}
