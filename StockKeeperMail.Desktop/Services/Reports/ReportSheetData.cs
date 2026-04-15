using System.Collections.Generic;

namespace StockKeeperMail.Desktop.Services.Reports
{
    /// <summary>
    /// Представляет лист отчета для экспорта.
    /// </summary>
    public class ReportSheetData
    {
        public string SheetName { get; set; }
        public List<string> Columns { get; set; } = new List<string>();
        public List<List<string>> Rows { get; set; } = new List<List<string>>();
    }
}
