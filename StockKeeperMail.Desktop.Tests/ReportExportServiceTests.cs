using StockKeeperMail.Desktop.Services.Reports;
using System.Text.RegularExpressions;

namespace StockKeeperMail.Desktop.Tests;

public class ReportExportServiceTests
{
    [Fact]
    public void BuildExcelXml_EscapesXmlAndSanitizesWorksheetName()
    {
        ReportSheetData sheet = new ReportSheetData
        {
            SheetName = "Очень длинное имя листа / с запретными : символами [для] Excel",
            Columns = ["Наименование", "Описание"],
            Rows =
            [
                ["Катетер & набор", "Размер <14CH>"]
            ]
        };

        string xml = ReportExportService.BuildExcelXml([sheet]);
        Match match = Regex.Match(xml, "ss:Name=\"([^\"]+)\"");

        Assert.True(match.Success);
        Assert.Contains("Катетер &amp; набор", xml);
        Assert.Contains("Размер &lt;14CH&gt;", xml);
        Assert.DoesNotContain("/", match.Groups[1].Value);
        Assert.DoesNotContain(":", match.Groups[1].Value);
        Assert.True(match.Groups[1].Value.Length <= 31);
    }

    [Fact]
    public void BuildExcelXml_ForMultipleSheets_CreatesWorksheetForEachSheet()
    {
        List<ReportSheetData> sheets =
        [
            new ReportSheetData
            {
                SheetName = "Товары",
                Columns = ["Наименование"],
                Rows = [["Корсет"]]
            },
            new ReportSheetData
            {
                SheetName = "Клиенты",
                Columns = ["ФИО"],
                Rows = [["Иванов Иван"]]
            }
        ];

        string xml = ReportExportService.BuildExcelXml(sheets);

        Assert.Contains("ss:Name=\"Товары\"", xml);
        Assert.Contains("ss:Name=\"Клиенты\"", xml);
    }
}
