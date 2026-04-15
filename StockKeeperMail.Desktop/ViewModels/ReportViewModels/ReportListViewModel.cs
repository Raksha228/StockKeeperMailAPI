using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Desktop.Services.Reports;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Windows;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel списка отчетов.
    /// </summary>
    public class ReportListViewModel : ViewModelBase
    {
        private bool _isDisposed;
        private readonly NavigationStore _navigationStore;
        private readonly AuthenticationStore _authenticationStore;

        private bool _isDialogOpen;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        public ObservableCollection<ReportHistoryItemViewModel> Reports { get; }

        public RelayCommand LoadReportsCommand { get; }
        public RelayCommand CreateReportCommand { get; }
        public RelayCommand<ReportHistoryItemViewModel> OpenReportCommand { get; }
        public RelayCommand<ReportHistoryItemViewModel> OpenFolderCommand { get; }

        public ReportListViewModel(NavigationStore navigationStore, AuthenticationStore authenticationStore)
        {
            _navigationStore = navigationStore;
            _authenticationStore = authenticationStore;
            Reports = new ObservableCollection<ReportHistoryItemViewModel>();

            LoadReportsCommand = new RelayCommand(LoadReports);
            CreateReportCommand = new RelayCommand(CreateReport);
            OpenReportCommand = new RelayCommand<ReportHistoryItemViewModel>(OpenReport);
            OpenFolderCommand = new RelayCommand<ReportHistoryItemViewModel>(OpenFolder);
        }

        private void LoadReports()
        {
            Reports.Clear();
            foreach (ReportHistoryItem item in ReportHistoryStore.GetAll().Where(x => !string.IsNullOrWhiteSpace(x.FilePath) && File.Exists(x.FilePath)).OrderByDescending(x => x.CreatedAt))
            {
                Reports.Add(new ReportHistoryItemViewModel(item));
            }
        }

        private void CreateReport()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateReportViewModel.LoadViewModel(_navigationStore, _authenticationStore, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        private void CloseDialogCallback()
        {
            LoadReports();
            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        private void OpenReport(ReportHistoryItemViewModel report)
        {
            if (report == null)
            {
                return;
            }

            if (!File.Exists(report.FilePath))
            {
                MessageBox.Show("Файл отчета не найден по указанному пути.", "Отчеты", MessageBoxButton.OK, MessageBoxImage.Warning);
                LoadReports();
                return;
            }

            Process.Start(new ProcessStartInfo
            {
                FileName = report.FilePath,
                UseShellExecute = true
            });
        }

        private void OpenFolder(ReportHistoryItemViewModel report)
        {
            if (report == null)
            {
                return;
            }

            string? directory = Path.GetDirectoryName(report.FilePath);
            if (string.IsNullOrWhiteSpace(directory) || !Directory.Exists(directory))
            {
                MessageBox.Show("Папка с отчетом не найдена.", "Отчеты", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            Process.Start(new ProcessStartInfo
            {
                FileName = directory,
                UseShellExecute = true
            });
        }

        public static ReportListViewModel LoadViewModel(NavigationStore navigationStore, AuthenticationStore authenticationStore)
        {
            ReportListViewModel viewModel = new ReportListViewModel(navigationStore, authenticationStore);
            viewModel.LoadReportsCommand.Execute(null);
            return viewModel;
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    _dialogViewModel?.Dispose();
                }
            }

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}
