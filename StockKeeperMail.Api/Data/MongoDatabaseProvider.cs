using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Создает подключение к MongoDB и предоставляет базу данных приложения.
    /// </summary>
    public class MongoDatabaseProvider
    {
        /// <summary>
        /// Инициализирует провайдер MongoDB.
        /// </summary>
        public MongoDatabaseProvider(IOptions<MongoDbOptions> options)
        {
            if (string.IsNullOrWhiteSpace(options.Value.ConnectionString))
            {
                throw new InvalidOperationException("Не задана строка подключения MongoDB:ConnectionString в appsettings.json.");
            }

            if (string.IsNullOrWhiteSpace(options.Value.DatabaseName))
            {
                throw new InvalidOperationException("Не задано имя базы MongoDB:DatabaseName в appsettings.json.");
            }

            MongoClient client = new MongoClient(options.Value.ConnectionString);
            Database = client.GetDatabase(options.Value.DatabaseName);
        }

        /// <summary>
        /// База данных MongoDB, с которой работает API.
        /// </summary>
        public IMongoDatabase Database { get; }
    }
}
