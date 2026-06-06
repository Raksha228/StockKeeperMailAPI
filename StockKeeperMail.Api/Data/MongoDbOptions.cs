namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Настройки подключения к MongoDB.
    /// </summary>
    public class MongoDbOptions
    {
        /// <summary>
        /// Строка подключения к MongoDB.
        /// </summary>
        public string ConnectionString { get; set; }

        /// <summary>
        /// Имя базы данных приложения.
        /// </summary>
        public string DatabaseName { get; set; }
    }
}
