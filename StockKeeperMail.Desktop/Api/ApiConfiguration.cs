using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace StockKeeperMail.Desktop.Api
{
    /// <summary>
    /// Загружает настройки подключения к REST API.
    /// </summary>
    public class ApiConfiguration
    {
        public string BaseUrl { get; init; }

        public static ApiConfiguration Load()
        {
            string basePath = AppContext.BaseDirectory;
            string configPath = Path.Combine(basePath, "apiconfig.json");

            if (!File.Exists(configPath))
            {
                configPath = Path.Combine(Directory.GetCurrentDirectory(), "apiconfig.json");
            }

            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.GetDirectoryName(configPath))
                .AddJsonFile(Path.GetFileName(configPath), optional: false, reloadOnChange: false)
                .Build();

            string baseUrl = configuration.GetSection("Api")["BaseUrl"];
            if (string.IsNullOrWhiteSpace(baseUrl))
            {
                throw new InvalidOperationException("В файле apiconfig.json не указан Api:BaseUrl.");
            }

            return new ApiConfiguration
            {
                BaseUrl = baseUrl.TrimEnd('/')
            };
        }
    }
}
