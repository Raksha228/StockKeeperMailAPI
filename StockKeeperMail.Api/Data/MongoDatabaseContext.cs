using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Обертка над IMongoDatabase и общими настройками сериализации.
    /// </summary>
    public class MongoDatabaseContext
    {
        private static bool _serializersRegistered;

        public MongoDatabaseContext(IOptions<MongoDbOptions> options)
        {
            RegisterSerializers();

            MongoClient client = new MongoClient(options.Value.ConnectionString);
            Database = client.GetDatabase(options.Value.DatabaseName);
        }

        public IMongoDatabase Database { get; }

        public IMongoCollection<TEntity> GetCollection<TEntity>()
        {
            string collectionName = ApiRouteMapper.GetRoute<TEntity>();
            return Database.GetCollection<TEntity>(collectionName);
        }

        private static void RegisterSerializers()
        {
            if (_serializersRegistered)
            {
                return;
            }

            try
            {
                BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));
            }
            catch
            {
            }

            try
            {
                BsonSerializer.RegisterSerializer(typeof(decimal), new DecimalSerializer(BsonType.Decimal128));
            }
            catch
            {
            }

            _serializersRegistered = true;
        }
    }
}
