using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка местоположений (складов/локаций).
    /// Управляет загрузкой, созданием, редактированием и удалением локаций.
    /// </summary>
    class LocationListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        public LocationListViewHelper LocationListViewHelper { get; }

        private readonly ObservableCollection<LocationViewModel> _locations;
        public ObservableCollection<LocationViewModel> Locations { get; }

        public RelayCommand LoadLocationsCommand { get; }
        public RelayCommand CreateLocationCommand { get; }
        public RelayCommand<LocationViewModel> EditLocationCommand { get; }
        public RelayCommand<LocationViewModel> RemoveLocationCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка локаций.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public LocationListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _locations = new ObservableCollection<LocationViewModel>();
            Locations = new ObservableCollection<LocationViewModel>();

            LocationListViewHelper = new LocationListViewHelper(_locations, Locations);

            LoadLocationsCommand = new RelayCommand(LoadData);
            RemoveLocationCommand = new RelayCommand<LocationViewModel>(RemoveLocation);
            CreateLocationCommand = new RelayCommand(CreateLocation);
            EditLocationCommand = new RelayCommand<LocationViewModel>(EditLocation);
        }

        /// <summary>
        /// Открывает диалог редактирования выбранной локации.
        /// </summary>
        /// <param name="locationViewModel">ViewModel локации для редактирования.</param>
        public void EditLocation(LocationViewModel locationViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditLocationViewModel.LoadViewModel(_navigationStore, _unitOfWork, locationViewModel.Location, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            SetProperty(ref _isDialogOpen, true, nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания новой локации.
        /// </summary>
        public void CreateLocation()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateLocationViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            SetProperty(ref _isDialogOpen, true, nameof(IsDialogOpen));
        }

        /// <summary>
        /// Удаляет выбранную локацию после подтверждения пользователя.
        /// </summary>
        /// <param name="locationViewModel">ViewModel удаляемой локации.</param>
        public void RemoveLocation(LocationViewModel locationViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.LocationRepository.Delete(locationViewModel.Location);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.LOCATIONS, ActionType.DELETE, $"Location deleted; LocationID:{locationViewModel.LocationID};"));
                _unitOfWork.Save();
                _locations.Remove(locationViewModel);
                LocationListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список локаций и закрывает диалог.
        /// </summary>
        public void CloseDialogCallback()
        {
            LoadLocationsCommand.Execute(null);
            SetProperty(ref _isDialogOpen, false, nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список всех локаций из базы данных.
        /// </summary>
        public void LoadData()
        {
            _locations.Clear();
            foreach (Location r in _unitOfWork.LocationRepository.Get())
            {
                _locations.Add(new LocationViewModel(r));
            }
            LocationListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр LocationListViewModel.</returns>
        public static LocationListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            LocationListViewModel viewModel = new LocationListViewModel(navigationStore);
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
                    _dialogViewModel?.Dispose();
                    LocationListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}