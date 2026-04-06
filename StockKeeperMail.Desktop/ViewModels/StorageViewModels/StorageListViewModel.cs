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
using System.Windows;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка складов (локаций).
    /// Управляет загрузкой локаций и переходом к деталям конкретного склада.
    /// </summary>
    class StorageListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        public StorageListViewHelper StorageListViewHelper { get; }

        private readonly ObservableCollection<LocationViewModel> _locations;
        public ObservableCollection<LocationViewModel> Locations { get; }

        public RelayCommand LoadLocationsCommand { get; }
        public RelayCommand CreateLocationCommand { get; }
        public RelayCommand<LocationViewModel> LocationDetailsCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка складов.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public StorageListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _locations = new ObservableCollection<LocationViewModel>();
            Locations = new ObservableCollection<LocationViewModel>();

            StorageListViewHelper = new StorageListViewHelper(_locations, Locations);

            LoadLocationsCommand = new RelayCommand(LoadLocations);
            LocationDetailsCommand = new RelayCommand<LocationViewModel>(LocationDetails);
        }

        /// <summary>
        /// Переходит к детальному просмотру выбранной локации.
        /// </summary>
        /// <param name="locationViewModel">ViewModel выбранной локации.</param>
        public void LocationDetails(LocationViewModel locationViewModel)
        {
            _navigationStore.CurrentViewModel = StorageDetailViewModel.LoadViewModel(_navigationStore, locationViewModel.Location.LocationID);
        }

        /// <summary>
        /// Загружает список всех локаций из базы данных.
        /// </summary>
        public void LoadLocations()
        {
            _locations.Clear();
            foreach (Location r in _unitOfWork.LocationRepository.Get())
            {
                _locations.Add(new LocationViewModel(r));
            }
            StorageListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр StorageListViewModel.</returns>
        public static StorageListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            StorageListViewModel viewModel = new StorageListViewModel(navigationStore);
            viewModel.LoadLocationsCommand.Execute(null);
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
                    StorageListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}