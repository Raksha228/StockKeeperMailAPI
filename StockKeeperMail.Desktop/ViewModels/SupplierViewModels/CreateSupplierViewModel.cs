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
    /// ViewModel для формы создания нового поставщика.
    /// Обеспечивает валидацию вводимых данных и сохранение поставщика в базу данных.
    /// </summary>
    public class CreateSupplierViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        public string _supplierName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [MinLength(2, ErrorMessage = "Имя должно быть длиннее 2 символов")]
        [MaxLength(50, ErrorMessage = "Имя не может превышать 50 символов")]
        public string SupplierName
        {
            get => _supplierName;
            set
            {
                SetProperty(ref _supplierName, value, true);
            }
        }

        private string _supplierAddress;

        [Required(ErrorMessage = "Адрес обязателен для заполнения")]
        [MinLength(10, ErrorMessage = "Адрес должен содержать не менее 10 символов")]
        public string SupplierAddress
        {
            get => _supplierAddress;
            set
            {
                SetProperty(ref _supplierAddress, value, true);
            }
        }

        private string _supplierPhone;

        [Required(ErrorMessage = "Номер телефона обязателен для заполнения")]
        public string SupplierPhone
        {
            get => _supplierPhone;
            set
            {
                SetProperty(ref _supplierPhone, value, true);
            }
        }

        private string _supplierEmail;

        [Required(ErrorMessage = "Email обязателен для заполнения")]
        [RegularExpression("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", ErrorMessage = "Неверный формат email")]
        public string SupplierEmail
        {
            get => _supplierEmail;
            set
            {
                SetProperty(ref _supplierEmail, value, true);
            }
        }

        private string _supplierStatus;

        [Required(ErrorMessage = "Статус обязателен для заполнения")]
        public string SupplierStatus
        {
            get { return _supplierStatus; }
            set
            {
                SetProperty(ref _supplierStatus, value, true);
            }
        }

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;
        private readonly Action _closeDialogCallback;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel создания поставщика.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateSupplierViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Отправляет данные формы, создаёт нового поставщика и сохраняет его в базе данных.
        /// Если валидация не пройдена, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            Supplier supplier = new Supplier()
            {
                SupplierID = Guid.NewGuid(),
                SupplierName = SupplierName,
                SupplierAddress = SupplierAddress,
                SupplierPhone = SupplierPhone,
                SupplierEmail = SupplierEmail,
                SupplierStatus = SupplierStatus
            };

            _unitOfWork.SupplierRepository.Insert(supplier);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.SUPPLIERS, ActionType.CREATE, $"New Supplier Created; SupplierID: {supplier.SupplierID};"));
            _unitOfWork.Save();
            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет создание поставщика и закрывает диалог.
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
        /// <returns>Экземпляр CreateSupplierViewModel.</returns>
        public static CreateSupplierViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            return new CreateSupplierViewModel(navigationStore, unitOfWork, closeDialogCallback);
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

        /// <summary>
        /// Проверяет, можно ли создать поставщика (всегда true).
        /// </summary>
        /// <param name="obj">Параметр команды.</param>
        /// <returns>Всегда true.</returns>
        public bool CanCreateSupplier(object obj)
        {
            return true;
        }
    }
}