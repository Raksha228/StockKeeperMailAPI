using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы редактирования существующего клиента.
    /// Обеспечивает валидацию вводимых данных и сохранение изменений в базе данных.
    /// </summary>
    class EditCustomerViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Customer _customer;

        private string _customerFirstName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [MinLength(2, ErrorMessage = "Имя должно быть длиннее 2 символов")]
        [MaxLength(50, ErrorMessage = "Имя не может превышать 50 символов")]
        public string CustomerFirstName
        {
            get => _customerFirstName;
            set
            {
                SetProperty(ref _customerFirstName, value, true);
            }
        }

        private string _customerLastName;

        [Required(ErrorMessage = "Фамилия обязательна для заполнения")]
        [MinLength(2, ErrorMessage = "Фамилия должна быть длиннее 2 символов")]
        [MaxLength(50, ErrorMessage = "Фамилия не может превышать 50 символов")]
        public string CustomerLastName
        {
            get => _customerLastName;
            set
            {
                SetProperty(ref _customerLastName, value, true);
            }
        }

        private string _customerAddress;

        [Required(ErrorMessage = "Адрес обязателен для заполнения")]
        [MinLength(20, ErrorMessage = "Адрес должен содержать не менее 20 символов")]
        [MaxLength(300, ErrorMessage = "Адрес не может превышать 300 символов")]
        public string CustomerAddress
        {
            get => _customerAddress;
            set
            {
                SetProperty(ref _customerAddress, value, true);
            }
        }

        private string _customerPhone;

        [Required(ErrorMessage = "Номер телефона обязателен для заполнения")]
        public string CustomerPhone
        {
            get => _customerPhone;
            set
            {
                SetProperty(ref _customerPhone, value, true);
            }
        }

        private string _customerEmail;

        [Required(ErrorMessage = "Email обязателен для заполнения")]
        [RegularExpression("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", ErrorMessage = "Неверный формат email")]
        public string CustomerEmail
        {
            get => _customerEmail;
            set
            {
                SetProperty(ref _customerEmail, value, true);
            }
        }

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly Action _closeDialogCallback;

        private readonly ObservableCollection<StaffViewModel> _staffs;
        public IEnumerable<StaffViewModel> Staffs => _staffs;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        public RelayCommand LoadStaffsCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования клиента.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="customer">Редактируемый клиент.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditCustomerViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Customer customer, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _customer = customer;
            _unitOfWork = unitOfWork;
            _staffs = new ObservableCollection<StaffViewModel>();
            _closeDialogCallback = closeDialogCallback;

            SetInitialValues(_customer);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
            LoadStaffsCommand = new RelayCommand(LoadStaffs);
        }

        /// <summary>
        /// Сохраняет изменения клиента в базе данных, если валидация пройдена.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }
            _customer.CustomerFirstname = CustomerFirstName;
            _customer.CustomerLastname = CustomerLastName;
            _customer.CustomerAddress = CustomerAddress;
            _customer.CustomerPhone = CustomerPhone;
            _customer.CustomerEmail = CustomerEmail;

            _unitOfWork.CustomerRepository.Update(_customer);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.CUSTOMERS, ActionType.UPDATE, $"Customer updated; CustomerID:{_customer.CustomerID};"));
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
        /// Загружает список сотрудников для выбора (при необходимости).
        /// </summary>
        private void LoadStaffs()
        {
            _staffs.Clear();
            foreach (Staff r in _unitOfWork.StaffRepository.Get())
            {
                _staffs.Add(new StaffViewModel(r));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="customer">Редактируемый клиент.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditCustomerViewModel.</returns>
        public static EditCustomerViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Customer customer, Action closeDialogCallback)
        {
            EditCustomerViewModel viewModel = new EditCustomerViewModel(navigationStore, unitOfWork, customer, closeDialogCallback);
            viewModel.LoadStaffsCommand.Execute(null);
            return viewModel;
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемого клиента.
        /// </summary>
        /// <param name="customer">Клиент, чьи значения используются.</param>
        private void SetInitialValues(Customer customer)
        {
            CustomerFirstName = customer.CustomerFirstname;
            CustomerLastName = customer.CustomerLastname;
            CustomerAddress = customer.CustomerAddress;
            CustomerPhone = customer.CustomerPhone;
            CustomerEmail = customer.CustomerEmail;
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