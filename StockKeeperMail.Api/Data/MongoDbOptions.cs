namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Содержит настройки подключения к MongoDB.
    /// </summary>
    public class MongoDbOptions
    {
        /// <summary>
        /// Строка подключения к MongoDB.
        /// </summary>
        public string ConnectionString { get; set; }
        /// <summary>
        /// Имя базы данных MongoDB.
        /// </summary>
        public string DatabaseName { get; set; }
    }
}
