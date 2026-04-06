namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Настройки подключения к MongoDB.
    /// </summary>
    public class MongoDbOptions
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
