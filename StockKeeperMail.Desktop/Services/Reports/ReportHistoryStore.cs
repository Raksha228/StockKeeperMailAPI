using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace StockKeeperMail.Desktop.Services.Reports
{
    /// <summary>
    /// Хранилище истории сформированных отчетов.
    /// </summary>
    public static class ReportHistoryStore
    {
        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };

        private static string BaseDirectory => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "StockKeeperMail");
        private static string HistoryFilePath => Path.Combine(BaseDirectory, "reports-history.json");

        public static List<ReportHistoryItem> GetAll()
        {
            EnsureStorage();

            if (!File.Exists(HistoryFilePath))
            {
                return new List<ReportHistoryItem>();
            }

            string json = File.ReadAllText(HistoryFilePath);
            if (string.IsNullOrWhiteSpace(json))
            {
                return new List<ReportHistoryItem>();
            }

            return JsonSerializer.Deserialize<List<ReportHistoryItem>>(json, JsonOptions) ?? new List<ReportHistoryItem>();
        }

        public static void Add(ReportHistoryItem item)
        {
            List<ReportHistoryItem> items = GetAll();
            items.RemoveAll(i => !string.IsNullOrWhiteSpace(i.FilePath) && !File.Exists(i.FilePath));
            items.Insert(0, item);
            SaveAll(items);
        }

        public static void SaveAll(List<ReportHistoryItem> items)
        {
            EnsureStorage();
            string json = JsonSerializer.Serialize(items, JsonOptions);
            File.WriteAllText(HistoryFilePath, json);
        }

        private static void EnsureStorage()
        {
            Directory.CreateDirectory(BaseDirectory);
        }
    }
}
