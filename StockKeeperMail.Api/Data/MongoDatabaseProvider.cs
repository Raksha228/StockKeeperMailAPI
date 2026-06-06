using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Создает подключение к MongoDB и предоставляет базу данных приложения.
    /// Важно: MongoClient сам по себе не открывает соединение сразу, поэтому для проверки
    /// доступности базы обязательно используется команда ping.
    /// </summary>
    public class MongoDatabaseProvider
    {
        private readonly IMongoClient _client;

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

            MongoUrl mongoUrl = MongoUrl.Create(options.Value.ConnectionString);
            MongoClientSettings settings = MongoClientSettings.FromUrl(mongoUrl);

            // Чтобы приложение не висело долго, если MongoDB выключена или указан неправильный порт.
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(3);
            settings.ConnectTimeout = TimeSpan.FromSeconds(3);
            settings.SocketTimeout = TimeSpan.FromSeconds(5);

            _client = new MongoClient(settings);
            DatabaseName = options.Value.DatabaseName;
            Database = _client.GetDatabase(DatabaseName);
        }

        /// <summary>
        /// Имя базы данных MongoDB.
        /// </summary>
        public string DatabaseName { get; }

        /// <summary>
        /// База данных MongoDB, с которой работает API.
        /// </summary>
        public IMongoDatabase Database { get; }

        /// <summary>
        /// Выполняет реальную проверку подключения к MongoDB.
        /// </summary>
        public async Task PingAsync(CancellationToken cancellationToken = default)
        {
            using CancellationTokenSource timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            timeout.CancelAfter(TimeSpan.FromSeconds(5));

            BsonDocumentCommand<BsonDocument> pingCommand = new BsonDocumentCommand<BsonDocument>(new BsonDocument("ping", 1));
            await Database.RunCommandAsync(pingCommand, cancellationToken: timeout.Token);
        }
    }
}
