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
using System.Windows.Controls;
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы редактирования существующего сотрудника.
    /// Позволяет изменять личные данные, роль, имя пользователя и пароль.
    /// </summary>
    public class EditStaffViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Staff _staff;

        private string _roleID;

        [Required(ErrorMessage = "Роль обязательна для заполнения")]
        public string RoleID
        {
            get => _roleID;
            set
            {
                SetProperty(ref _roleID, value, true);
            }
        }

        private string _staffFirstName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [MinLength(2, ErrorMessage = "Имя должно быть длиннее 2 символов")]
        [MaxLength(50, ErrorMessage = "Имя не может превышать 50 символов")]
        public string StaffFirstName
        {
            get => _staffFirstName;
            set
            {
                SetProperty(ref _staffFirstName, value, true);
            }
        }

        private string _staffLastName;

        [Required(ErrorMessage = "Фамилия обязательна для заполнения")]
        [MinLength(2, ErrorMessage = "Фамилия должна быть длиннее 2 символов")]
        [MaxLength(50, ErrorMessage = "Фамилия не может превышать 50 символов")]
        public string StaffLastName
        {
            get => _staffLastName;
            set
            {
                SetProperty(ref _staffLastName, value, true);
            }
        }

        private string _staffAddress;

        [Required(ErrorMessage = "Адрес обязателен для заполнения")]
        [MinLength(20, ErrorMessage = "Адрес должен содержать не менее 20 символов")]
        [MaxLength(300, ErrorMessage = "Адрес не может превышать 300 символов")]
        public string StaffAddress
        {
            get => _staffAddress;
            set
            {
                SetProperty(ref _staffAddress, value, true);
            }
        }

        private string _staffPhone;

        [Required(ErrorMessage = "Номер телефона обязателен для заполнения")]
        public string StaffPhone
        {
            get => _staffPhone;
            set
            {
                SetProperty(ref _staffPhone, value, true);
            }
        }

        private string _staffEmail;

        [Required(ErrorMessage = "Email обязателен для заполнения")]
        [RegularExpression("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", ErrorMessage = "Неверный формат email")]
        public string StaffEmail
        {
            get => _staffEmail;
            set
            {
                SetProperty(ref _staffEmail, value, true);
            }
        }

        private string _staffUsername;

        [Required(ErrorMessage = "Имя пользователя обязательно для заполнения")]
        [MinLength(2, ErrorMessage = "Имя пользователя должно содержать не менее 2 символов")]
        [MaxLength(50, ErrorMessage = "Имя пользователя не может превышать 50 символов")]
        public string StaffUsername
        {
            get => _staffUsername;
            set
            {
                SetProperty(ref _staffUsername, value, true);
            }
        }

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly Action _closeDialogCallback;

        private readonly ObservableCollection<RoleViewModel> _roles;
        public IEnumerable<RoleViewModel> Roles => _roles;

        public RelayCommand<object> SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        public RelayCommand LoadRolesCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования сотрудника.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="staff">Редактируемый сотрудник.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditStaffViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Staff staff, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _staff = staff;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;
            _roles = new ObservableCollection<RoleViewModel>();

            SetInitialValues(_staff);

            SubmitCommand = new RelayCommand<object>(Submit);
            CancelCommand = new RelayCommand(Cancel);
            LoadRolesCommand = new RelayCommand(LoadRoles);
        }

        /// <summary>
        /// Сохраняет изменения сотрудника в базе данных, если валидация пройдена.
        /// </summary>
        /// <param name="obj">Объект PasswordBox для получения нового пароля.</param>
        private void Submit(object obj)
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            PasswordBox passwordBox = obj as PasswordBox;

            _staff.RoleID = new Guid(_roleID);
            _staff.StaffFirstName = StaffFirstName;
            _staff.StaffLastName = StaffLastName;
            _staff.StaffAddress = StaffAddress;
            _staff.StaffPhone = StaffPhone;
            _staff.StaffEmail = StaffEmail;
            _staff.StaffUsername = StaffUsername;
            _staff.StaffPassword = passwordBox.Password;

            _unitOfWork.StaffRepository.Update(_staff);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.STAFFS, ActionType.UPDATE, $"Staff Updated; StaffID:{_staff.StaffID};"));
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
        /// Загружает список ролей из базы данных.
        /// </summary>
        private void LoadRoles()
        {
            _roles.Clear();
            foreach (Role r in _unitOfWork.RoleRepository.Get())
            {
                _roles.Add(new RoleViewModel(r));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="staff">Редактируемый сотрудник.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditStaffViewModel.</returns>
        public static EditStaffViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Staff staff, Action closeDialogCallback)
        {
            EditStaffViewModel viewModel = new EditStaffViewModel(navigationStore, unitOfWork, staff, closeDialogCallback);
            viewModel.LoadRolesCommand.Execute(null);
            return viewModel;
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемого сотрудника.
        /// </summary>
        /// <param name="staff">Сотрудник, чьи значения используются.</param>
        private void SetInitialValues(Staff staff)
        {
            RoleID = staff.RoleID.ToString();
            StaffFirstName = staff.StaffFirstName;
            StaffLastName = staff.StaffLastName;
            StaffAddress = staff.StaffAddress;
            StaffPhone = staff.StaffPhone;
            StaffEmail = staff.StaffEmail;
            StaffUsername = staff.StaffUsername;
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