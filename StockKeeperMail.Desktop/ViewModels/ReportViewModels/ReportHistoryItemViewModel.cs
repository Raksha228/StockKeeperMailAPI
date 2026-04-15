using StockKeeperMail.Desktop.Services.Reports;
using System.Globalization;
using System.IO;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel одной записи истории отчетов.
    /// </summary>
    public class ReportHistoryItemViewModel : ViewModelBase
    {
        private readonly ReportHistoryItem _item;

        public ReportHistoryItem Item => _item;
        public string ReportName => _item.ReportName;
        public string FilePath => _item.FilePath;
        public string CreatedBy => _item.CreatedBy;
        public string Format => _item.Format;
        public string Sections => _item.Sections;
        public string CreatedAt => _item.CreatedAt.ToString("dd.MM.yyyy HH:mm", CultureInfo.InvariantCulture);
        public string FileStatus => File.Exists(_item.FilePath) ? "Файл найден" : "Файл не найден";

        public ReportHistoryItemViewModel(ReportHistoryItem item)
        {
            _item = item;
        }
    }
}
