using System;

namespace StockKeeperMail.Desktop.Services.Reports
{
    /// <summary>
    /// Представляет сохраненную запись о сформированном отчете.
    /// </summary>
    public class ReportHistoryItem
    {
        public Guid ReportID { get; set; }
        public string ReportName { get; set; }
        public string FilePath { get; set; }
        public string Format { get; set; }
        public string Sections { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
