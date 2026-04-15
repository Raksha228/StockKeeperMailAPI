using CommunityToolkit.Mvvm.Input;
using Microsoft.Win32;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Services.Reports;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel диалога создания отчета.
    /// </summary>
    public class CreateReportViewModel : ViewModelBase
    {
        private bool _isDisposed;
        private readonly NavigationStore _navigationStore;
        private readonly AuthenticationStore _authenticationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly Action _closeDialogCallback;

        private string _reportName;
        public string ReportName
        {
            get => _reportName;
            set => SetProperty(ref _reportName, value, true);
        }

        public ObservableCollection<ReportSectionOptionViewModel> SectionOptions { get; }

        public RelayCommand CreateReportCommand { get; }
        public RelayCommand PrintReportCommand { get; }
        public RelayCommand CloseDialogCommand { get; }

        public CreateReportViewModel(NavigationStore navigationStore, AuthenticationStore authenticationStore, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _authenticationStore = authenticationStore;
            _unitOfWork = new UnitOfWork();
            _closeDialogCallback = closeDialogCallback;

            ReportName = $"Отчет_{DateTime.Now:yyyyMMdd_HHmm}";
            SectionOptions = new ObservableCollection<ReportSectionOptionViewModel>();

            CreateReportCommand = new RelayCommand(CreateReport);
            PrintReportCommand = new RelayCommand(PrintReport);
            CloseDialogCommand = new RelayCommand(CloseDialog);

            LoadOptions();
        }

        private void LoadOptions()
        {
            Role role = _authenticationStore.CurrentStaff?.Role;

            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Invoices, "Счета на оплату", role?.OrdersView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Orders, "Заказы", role?.OrdersView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Customers, "Клиенты", role?.CustomersView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Products, "Товары", role?.ProductsView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Warehouses, "Склады", role?.StoragesView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Defectives, "Брак", role?.DefectivesView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Categories, "Категории", role?.CategoriesView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Locations, "Склады/магазины", role?.LocationsView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Suppliers, "Поставщики", role?.SuppliersView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Roles, "Роли", role?.RolesView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Staffs, "Сотрудники", role?.StaffsView ?? false));
            SectionOptions.Add(new ReportSectionOptionViewModel(ReportSectionKey.Messages, "Сообщения", true));
        }

        private void CreateReport()
        {
            var selectedSections = GetSelectedSections();
            if (!selectedSections.Any())
            {
                MessageBox.Show("Выберите хотя бы один раздел отчета.", "Создание отчета", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            SaveFileDialog saveFileDialog = new SaveFileDialog
            {
                Title = "Сохранение отчета",
                Filter = "Excel XML Workbook (*.xml)|*.xml",
                FileName = SanitizeFileName(ReportName) + ".xml",
                InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments)
            };

            if (saveFileDialog.ShowDialog() != true)
            {
                return;
            }

            var sheets = ReportExportService.BuildSheets(selectedSections, _unitOfWork);
            string xml = ReportExportService.BuildExcelXml(sheets);
            File.WriteAllText(saveFileDialog.FileName, xml);

            ReportHistoryStore.Add(new ReportHistoryItem
            {
                ReportID = Guid.NewGuid(),
                ReportName = Path.GetFileNameWithoutExtension(saveFileDialog.FileName),
                FilePath = saveFileDialog.FileName,
                Format = "Excel XML",
                Sections = string.Join(", ", SectionOptions.Where(x => x.IsSelected && x.IsAvailable).Select(x => x.DisplayName)),
                CreatedBy = GetCurrentStaffName(),
                CreatedAt = DateTime.Now
            });

            MessageBox.Show("Отчет успешно сохранен. Файл открывается в Microsoft Excel.", "Создание отчета", MessageBoxButton.OK, MessageBoxImage.Information);
            CloseDialog();
        }

        private void PrintReport()
        {
            var selectedSections = GetSelectedSections();
            if (!selectedSections.Any())
            {
                MessageBox.Show("Выберите хотя бы один раздел отчета.", "Печать отчета", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var sheets = ReportExportService.BuildSheets(selectedSections, _unitOfWork);
            FlowDocument document = ReportExportService.BuildPrintableDocument(sheets);
            PrintDialog printDialog = new PrintDialog();
            if (printDialog.ShowDialog() == true)
            {
                IDocumentPaginatorSource documentPaginator = document;
                printDialog.PrintDocument(documentPaginator.DocumentPaginator, string.IsNullOrWhiteSpace(ReportName) ? "Отчет" : ReportName);
            }
        }

        private ReportSectionKey[] GetSelectedSections()
        {
            return SectionOptions
                .Where(x => x.IsAvailable && x.IsSelected)
                .Select(x => x.SectionKey)
                .ToArray();
        }

        private string GetCurrentStaffName()
        {
            Staff currentStaff = _authenticationStore.CurrentStaff;
            if (currentStaff == null)
            {
                return "Неизвестный пользователь";
            }

            return $"{currentStaff.StaffFirstName} {currentStaff.StaffLastName}".Trim();
        }

        private string SanitizeFileName(string fileName)
        {
            string result = string.IsNullOrWhiteSpace(fileName) ? $"Отчет_{DateTime.Now:yyyyMMdd_HHmm}" : fileName.Trim();
            foreach (char invalidChar in Path.GetInvalidFileNameChars())
            {
                result = result.Replace(invalidChar, '_');
            }
            return result;
        }

        private void CloseDialog()
        {
            _closeDialogCallback?.Invoke();
        }

        public static CreateReportViewModel LoadViewModel(NavigationStore navigationStore, AuthenticationStore authenticationStore, Action closeDialogCallback)
        {
            return new CreateReportViewModel(navigationStore, authenticationStore, closeDialogCallback);
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    _unitOfWork.Dispose();
                }
            }

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}
