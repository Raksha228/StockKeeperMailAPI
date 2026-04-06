using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Базовый репозиторий MongoDB для CRUD-операций.
    /// </summary>
    public class MongoRepository<TEntity> where TEntity : class
    {
        private readonly IMongoCollection<TEntity> _collection;

        public MongoRepository(MongoDatabaseContext context)
        {
            _collection = context.GetCollection<TEntity>();
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            return await _collection.Find(Builders<TEntity>.Filter.Empty).ToListAsync();
        }

        public async Task<TEntity> GetFirstOrDefaultAsync(FilterDefinition<TEntity> filter)
        {
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task InsertAsync(TEntity entity)
        {
            await _collection.InsertOneAsync(entity);
        }

        public async Task ReplaceAsync(TEntity entity)
        {
            FilterDefinition<TEntity> filter = EntityKeyFilterBuilder.Build(entity);
            await _collection.ReplaceOneAsync(filter, entity, new ReplaceOptions { IsUpsert = false });
        }

        public async Task DeleteAsync(TEntity entity)
        {
            FilterDefinition<TEntity> filter = EntityKeyFilterBuilder.Build(entity);
            await _collection.DeleteOneAsync(filter);
        }

        public async Task DeleteManyAsync(FilterDefinition<TEntity> filter)
        {
            await _collection.DeleteManyAsync(filter);
        }

        public async Task InsertManyAsync(IEnumerable<TEntity> entities)
        {
            await _collection.InsertManyAsync(entities);
        }

        public async Task ReplaceManyAsync(IEnumerable<TEntity> entities)
        {
            foreach (TEntity entity in entities)
            {
                await ReplaceAsync(entity);
            }
        }
    }
}
