using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка логов (журнала событий).
    /// Загружает логи из базы данных в порядке убывания даты.
    /// </summary>
    class LogListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        public LogListViewHelper LogListViewHelper { get; }

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        private readonly ObservableCollection<LogViewModel> _logs;
        public ObservableCollection<LogViewModel> Logs { get; }

        public RelayCommand LoadLogsCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка логов.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public LogListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _logs = new ObservableCollection<LogViewModel>();
            Logs = new ObservableCollection<LogViewModel>();

            LogListViewHelper = new LogListViewHelper(_logs, Logs);
            LoadLogsCommand = new RelayCommand(LoadLogs);
        }

        /// <summary>
        /// Загружает список логов из базы данных, сортируя по дате (сначала новые).
        /// </summary>
        private void LoadLogs()
        {
            _logs.Clear();
            foreach (Log s in _unitOfWork.LogRepository.Get(orderBy: l => l.OrderByDescending(l => l.DateTime), includeProperties: "Staff"))
            {
                _logs.Add(new LogViewModel(s));
            }
            LogListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр LogListViewModel.</returns>
        public static LogListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            LogListViewModel viewModel = new LogListViewModel(navigationStore);
            viewModel.LoadLogsCommand.Execute(null);
            return viewModel;
        }

        /// <summary>
        /// Освобождает ресурсы, используемые ViewModel.
        /// </summary>
        /// <param name="disposing">Указывает, нужно ли освобождать управляемые ресурсы.</param>
        protected override void Dispose(bool disposing)
        {
            // Примечание: реализуйте финализатор только если объект содержит неуправляемые ресурсы

            if (!this._isDisposed)
            {
                if (disposing) // освобождаем все неуправляемые и управляемые ресурсы
                {
                    // освобождение ресурсов
                    _unitOfWork.Dispose();
                    LogListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}