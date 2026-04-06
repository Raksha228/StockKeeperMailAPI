using System;
using System.Net.Http;
using System.Net.Http.Json;

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
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        private static HttpClient CreateClient()
        {
            ApiConfiguration configuration = ApiConfiguration.Load();

            HttpClient client = new HttpClient
            {
                BaseAddress = new Uri(configuration.BaseUrl + "/")
            };

            return client;
        }
    }
}
