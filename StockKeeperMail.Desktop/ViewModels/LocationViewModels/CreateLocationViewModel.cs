using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы создания нового местоположения (склада/локации).
    /// </summary>
    class CreateLocationViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        public string _locationName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        public string LocationName
        {
            get => _locationName;
            set
            {
                SetProperty(ref _locationName, value);
            }
        }

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        /// <summary>
        /// Событие, возникающее при успешной отправке формы (создана локация).
        /// </summary>
        public event Action<Location> Submitted;

        protected virtual void OnSubmit(Location location)
        {
            Submitted?.Invoke(location);
        }

        /// <summary>
        /// Событие, возникающее при отмене операции.
        /// </summary>
        public event Action Cancelled;

        protected virtual void OnCancel()
        {
            Cancelled?.Invoke();
        }

        public ICommand SubmitCommand { get; set; }
        public ICommand CancelCommand { get; set; }
        private readonly Action _closeDialogCallback;

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel создания локации.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateLocationViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            _unitOfWork = unitOfWork;
            _navigationStore = navigationStore;
            _closeDialogCallback = closeDialogCallback;
            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Выполняет навигацию к списку местоположений.
        /// </summary>
        public void NavigateToLocationList()
        {
            _navigationStore.CurrentViewModel = LocationListViewModel.LoadViewModel(_navigationStore);
        }

        /// <summary>
        /// Отправляет данные формы, создаёт новую локацию и сохраняет её в базе данных.
        /// Если валидация не пройдена, сохранение не выполняется.
        /// </summary>
        public void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            Location newLocation = new Location()
            {
                LocationID = Guid.NewGuid(),
                LocationName = _locationName
            };

            _unitOfWork.LocationRepository.Insert(newLocation);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.LOCATIONS, ActionType.CREATE, $"New location created; LocationID: {newLocation.LocationID};"));
            _unitOfWork.Save();
            MessageBox.Show("Успешно");

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет создание локации и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр CreateLocationViewModel.</returns>
        public static CreateLocationViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            return new CreateLocationViewModel(navigationStore, unitOfWork, closeDialogCallback);
        }

        /// <summary>
        /// Освобождает ресурсы, используемые ViewModel.
        /// </summary>
        /// <param name="disposing">Указывает, нужно ли освобождать управляемые ресурсы.</param>
        protected override void Dispose(bool disposing)
        {
            if (!this._isDisposed)
            {
                if (disposing)
                {
                    // освобождение управляемых ресурсов
                }
                // освобождение неуправляемых ресурсов
            }
            this._isDisposed = true;

            base.Dispose(disposing);
        }
    }
}