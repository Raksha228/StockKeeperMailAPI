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
    /// ViewModel для формы редактирования существующего местоположения (склада/локации).
    /// </summary>
    class EditLocationViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Location _location;

        public string _locationName;

        [Required(ErrorMessage = "Название локации обязательно для заполнения")]
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
        /// Событие, возникающее при успешной отправке формы (локация обновлена).
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
        /// Инициализирует новый экземпляр ViewModel редактирования локации.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="location">Редактируемая локация.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditLocationViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Location location, Action closeDialogCallback)
        {
            _unitOfWork = new UnitOfWork();
            _navigationStore = navigationStore;
            _location = location;
            _closeDialogCallback = closeDialogCallback;

            SetInitialValues(_location);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемой локации.
        /// </summary>
        /// <param name="location">Локация, чьи значения используются.</param>
        private void SetInitialValues(Location location)
        {
            _locationName = location.LocationName;
        }

        /// <summary>
        /// Сохраняет изменения локации в базе данных, если валидация пройдена.
        /// </summary>
        public void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            _location.LocationName = _locationName;

            _unitOfWork.LocationRepository.Update(_location);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.LOCATIONS, ActionType.UPDATE, $"New location created; LocationID: {_location.LocationID};"));
            _unitOfWork.Save();

            MessageBox.Show("Успешно");
            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет редактирование и закрывает диалог без сохранения изменений.
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
        /// <param name="location">Редактируемая локация.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditLocationViewModel.</returns>
        public static EditLocationViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Location location, Action closeDialogCallback)
        {
            return new EditLocationViewModel(navigationStore, unitOfWork, location, closeDialogCallback);
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