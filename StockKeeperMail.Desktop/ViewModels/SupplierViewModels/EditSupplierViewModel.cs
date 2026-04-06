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
    /// ViewModel для формы редактирования существующего поставщика.
    /// Обеспечивает валидацию вводимых данных и сохранение изменений в базе данных.
    /// </summary>
    public class EditSupplierViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Supplier _supplier;

        public string _supplierName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [MinLength(2, ErrorMessage = "Имя должно быть длиннее 2 символов")]
        [MaxLength(50, ErrorMessage = "Имя не может превышать 50 символов")]
        public string SupplierName
        {
            get => _supplierName;
            set
            {
                SetProperty(ref _supplierName, value);
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
                SetProperty(ref _supplierAddress, value);
            }
        }

        private string _supplierPhone;

        [Required(ErrorMessage = "Номер телефона обязателен для заполнения")]
        public string SupplierPhone
        {
            get => _supplierPhone;
            set
            {
                SetProperty(ref _supplierPhone, value);
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
                SetProperty(ref _supplierEmail, value);
            }
        }

        private string _supplierStatus;

        [Required(ErrorMessage = "Статус обязателен для заполнения")]
        public string SupplierStatus
        {
            get { return _supplierStatus; }
            set
            {
                SetProperty(ref _supplierStatus, value);
            }
        }

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;
        private readonly Action _closeDialogCallback;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования поставщика.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="supplier">Редактируемый поставщик.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditSupplierViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Supplier supplier, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;

            _supplier = supplier;
            SetInitialValues(_supplier);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемого поставщика.
        /// </summary>
        /// <param name="supplier">Поставщик, чьи значения используются.</param>
        private void SetInitialValues(Supplier supplier)
        {
            SupplierName = supplier.SupplierName;
            SupplierAddress = supplier.SupplierAddress;
            SupplierEmail = supplier.SupplierEmail;
            SupplierPhone = supplier.SupplierPhone;
            SupplierStatus = supplier.SupplierStatus;
        }

        /// <summary>
        /// Сохраняет изменения поставщика в базе данных, если валидация пройдена.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            _supplier.SupplierName = _supplierName;
            _supplier.SupplierAddress = _supplierAddress;
            _supplier.SupplierEmail = _supplierEmail;
            _supplier.SupplierPhone = _supplierPhone;
            _supplier.SupplierStatus = _supplierStatus;

            _unitOfWork.SupplierRepository.Update(_supplier);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.SUPPLIERS, ActionType.UPDATE, $"Supplier updated; SupplierID: {_supplier.SupplierID};"));
            _unitOfWork.Save();
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
        /// <param name="supplier">Редактируемый поставщик.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditSupplierViewModel.</returns>
        public static EditSupplierViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Supplier supplier, Action closeDialogCallback)
        {
            EditSupplierViewModel viewModel = new EditSupplierViewModel(navigationStore, unitOfWork, supplier, closeDialogCallback);
            return viewModel;
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
        /// Проверяет, можно ли изменять поставщика (всегда true).
        /// </summary>
        /// <param name="obj">Параметр команды.</param>
        /// <returns>Всегда true.</returns>
        public bool CanModifySupplier(object obj)
        {
            return true;
        }
    }
}