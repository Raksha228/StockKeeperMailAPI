using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Базовый репозиторий MongoDB для выполнения CRUD-операций.
    /// </summary>
    public class MongoRepository<TEntity> where TEntity : class
    {
        private readonly IMongoCollection<TEntity> _collection;

        /// <summary>
        /// Инициализирует репозиторий для указанного типа сущности.
        /// </summary>
        public MongoRepository(MongoDatabaseContext context)
        {
            _collection = context.GetCollection<TEntity>();
        }

        /// <summary>
        /// Возвращает все документы коллекции.
        /// </summary>
        public async Task<List<TEntity>> GetAllAsync()
        {
            return await _collection.Find(Builders<TEntity>.Filter.Empty).ToListAsync();
        }

        /// <summary>
        /// Возвращает первый документ, удовлетворяющий фильтру.
        /// </summary>
        public async Task<TEntity> GetFirstOrDefaultAsync(FilterDefinition<TEntity> filter)
        {
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Добавляет новый документ в коллекцию.
        /// </summary>
        public async Task InsertAsync(TEntity entity)
        {
            await _collection.InsertOneAsync(entity);
        }

        /// <summary>
        /// Полностью заменяет существующий документ по ключу.
        /// </summary>
        public async Task ReplaceAsync(TEntity entity)
        {
            FilterDefinition<TEntity> filter = EntityKeyFilterBuilder.Build(entity);
            await _collection.ReplaceOneAsync(filter, entity, new ReplaceOptions { IsUpsert = false });
        }

        /// <summary>
        /// Удаляет документ по ключу сущности.
        /// </summary>
        public async Task DeleteAsync(TEntity entity)
        {
            FilterDefinition<TEntity> filter = EntityKeyFilterBuilder.Build(entity);
            await _collection.DeleteOneAsync(filter);
        }

        /// <summary>
        /// Удаляет набор документов по фильтру.
        /// </summary>
        public async Task DeleteManyAsync(FilterDefinition<TEntity> filter)
        {
            await _collection.DeleteManyAsync(filter);
        }

        /// <summary>
        /// Добавляет набор документов в коллекцию.
        /// </summary>
        public async Task InsertManyAsync(IEnumerable<TEntity> entities)
        {
            await _collection.InsertManyAsync(entities);
        }

        /// <summary>
        /// Последовательно обновляет набор документов.
        /// </summary>
        public async Task ReplaceManyAsync(IEnumerable<TEntity> entities)
        {
            foreach (TEntity entity in entities)
            {
                await ReplaceAsync(entity);
            }
        }
    }
}
