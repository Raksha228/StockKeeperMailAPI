using System;
using System.Net.Http;
using System.Text.Json;

namespace StockKeeperMail.Desktop.Api
{
    /// <summary>
    /// Предоставляет единый HttpClient для всего WPF-клиента.
    /// </summary>
    public static class ApiClientFactory
    {
        private static readonly Lazy<HttpClient> _client = new Lazy<HttpClient>(CreateClient);

        public static HttpClient Client => _client.Value;

        public static bool IsApiAvailable()
        {
            try
            {
                using HttpResponseMessage response = Client.GetAsync("api/health").GetAwaiter().GetResult();
                if (!response.IsSuccessStatusCode)
                {
                    return false;
                }

                string json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                using JsonDocument document = JsonDocument.Parse(json);

                string status = ReadString(document, "status");
                string database = ReadString(document, "database");

                return string.Equals(status, "ok", StringComparison.OrdinalIgnoreCase)
                    && string.Equals(database, "ok", StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }

        private static string ReadString(JsonDocument document, string propertyName)
        {
            if (document.RootElement.TryGetProperty(propertyName, out JsonElement element)
                && element.ValueKind == JsonValueKind.String)
            {
                return element.GetString();
            }

            return string.Empty;
        }

        private static HttpClient CreateClient()
        {
            ApiConfiguration configuration = ApiConfiguration.Load();

            HttpClient client = new HttpClient
            {
                BaseAddress = new Uri(configuration.BaseUrl + "/"),
                Timeout = TimeSpan.FromSeconds(10)
            };

            return client;
        }
    }
}
