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
    /// ViewModel для формы редактирования существующей роли.
    /// Позволяет изменять название, описание, статус и привилегии роли.
    /// </summary>
    public class EditRoleViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Role _role;

        public string _roleName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [MinLength(2, ErrorMessage = "Имя должно быть длиннее 2 символов")]
        [MaxLength(50, ErrorMessage = "Имя не может превышать 50 символов")]
        public string RoleName
        {
            get => _roleName;
            set
            {
                SetProperty(ref _roleName, value, true);
            }
        }

        private string _roleDescription;

        [Required(ErrorMessage = "Описание обязательно для заполнения")]
        [MinLength(10, ErrorMessage = "Описание должно содержать не менее 10 символов")]
        [MaxLength(50, ErrorMessage = "Описание не может превышать 50 символов")]
        public string RoleDescription
        {
            get => _roleDescription;
            set
            {
                SetProperty(ref _roleDescription, value, true);
            }
        }

        private string _roleStatus;

        [Required(ErrorMessage = "Статус обязателен для заполнения")]
        public string RoleStatus
        {
            get { return _roleStatus; }
            set
            {
                SetProperty(ref _roleStatus, value, true);
            }
        }

        public RolePrivilegesHelper RolePrivilegesHelper { get; }

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;
        private readonly Action _closeDialogCallback;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования роли.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="role">Редактируемая роль.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditRoleViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Role role, Action closeDialogCallback)
        {
            _unitOfWork = unitOfWork;
            _navigationStore = navigationStore;
            _closeDialogCallback = closeDialogCallback;
            _role = role;

            RolePrivilegesHelper = new RolePrivilegesHelper(role);

            RoleName = _role.RoleName;
            RoleDescription = _role.RoleDescription;
            RoleStatus = _role.RoleStatus;

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Сохраняет изменения роли в базе данных, если валидация пройдена.
        /// Обновляет название, описание, статус и все привилегии.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            _role.RoleName = RoleName;
            _role.RoleDescription = RoleDescription;
            _role.RoleStatus = RoleStatus;
            _role.OrdersView = RolePrivilegesHelper.OrdersView;
            _role.OrdersAdd = RolePrivilegesHelper.OrdersAdd;
            _role.OrdersEdit = RolePrivilegesHelper.OrdersEdit;
            _role.OrdersDelete = RolePrivilegesHelper.OrdersDelete;

            _role.CustomersView = RolePrivilegesHelper.CustomersView;
            _role.CustomersAdd = RolePrivilegesHelper.CustomersAdd;
            _role.CustomersEdit = RolePrivilegesHelper.CustomersEdit;
            _role.CustomersDelete = RolePrivilegesHelper.CustomersDelete;

            _role.ProductsView = RolePrivilegesHelper.ProductsView;
            _role.ProductsAdd = RolePrivilegesHelper.ProductsAdd;
            _role.ProductsEdit = RolePrivilegesHelper.ProductsEdit;
            _role.ProductsDelete = RolePrivilegesHelper.ProductsDelete;

            _role.StoragesView = RolePrivilegesHelper.StoragesView;
            _role.StoragesAdd = RolePrivilegesHelper.StoragesAdd;
            _role.StoragesEdit = RolePrivilegesHelper.StoragesEdit;
            _role.StoragesDelete = RolePrivilegesHelper.StoragesDelete;

            _role.DefectivesView = RolePrivilegesHelper.DefectivesView;
            _role.DefectivesAdd = RolePrivilegesHelper.DefectivesAdd;
            _role.DefectivesEdit = RolePrivilegesHelper.DefectivesEdit;
            _role.DefectivesDelete = RolePrivilegesHelper.DefectivesDelete;

            _role.CategoriesView = RolePrivilegesHelper.CategoriesView;
            _role.CategoriesAdd = RolePrivilegesHelper.CategoriesAdd;
            _role.CategoriesEdit = RolePrivilegesHelper.CategoriesEdit;
            _role.CategoriesDelete = RolePrivilegesHelper.CategoriesDelete;

            _role.LocationsView = RolePrivilegesHelper.LocationsView;
            _role.LocationsAdd = RolePrivilegesHelper.LocationsAdd;
            _role.LocationsEdit = RolePrivilegesHelper.LocationsEdit;
            _role.LocationsDelete = RolePrivilegesHelper.LocationsDelete;

            _role.SuppliersView = RolePrivilegesHelper.SuppliersView;
            _role.SuppliersAdd = RolePrivilegesHelper.SuppliersAdd;
            _role.SuppliersEdit = RolePrivilegesHelper.SuppliersEdit;
            _role.SuppliersDelete = RolePrivilegesHelper.SuppliersDelete;

            _role.RolesView = RolePrivilegesHelper.RolesView;
            _role.RolesAdd = RolePrivilegesHelper.RolesAdd;
            _role.RolesEdit = RolePrivilegesHelper.RolesEdit;
            _role.RolesDelete = RolePrivilegesHelper.RolesDelete;

            _role.StaffsView = RolePrivilegesHelper.StaffsView;
            _role.StaffsAdd = RolePrivilegesHelper.StaffsAdd;
            _role.StaffsEdit = RolePrivilegesHelper.StaffsEdit;
            _role.StaffsDelete = RolePrivilegesHelper.StaffsDelete;

            _role.LogsView = RolePrivilegesHelper.LogsView;
            _role.LogsAdd = RolePrivilegesHelper.LogsAdd;
            _role.LogsEdit = RolePrivilegesHelper.LogsEdit;
            _role.LogsDelete = RolePrivilegesHelper.LogsDelete;

            _unitOfWork.RoleRepository.Update(_role);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ROLES, ActionType.CREATE, $"Role updated; RoleID:{_role.RoleID};"));
            _unitOfWork.Save();

            _closeDialogCallback();
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="role">Редактируемая роль.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditRoleViewModel.</returns>
        public static EditRoleViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Role role, Action closeDialogCallback)
        {
            EditRoleViewModel viewModel = new EditRoleViewModel(navigationStore, unitOfWork, role, closeDialogCallback);
            return viewModel;
        }

        /// <summary>
        /// Отменяет редактирование и закрывает диалог без сохранения изменений.
        /// </summary>
        public void Cancel()
        {
            _closeDialogCallback();
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
                    RolePrivilegesHelper.Dispose();
                }
                // освобождение неуправляемых ресурсов
            }
            this._isDisposed = true;

            base.Dispose(disposing);
        }

        /// <summary>
        /// Проверяет, можно ли изменять роль (всегда true).
        /// </summary>
        /// <param name="obj">Параметр команды.</param>
        /// <returns>Всегда true.</returns>
        public bool CanModifyRole(object obj)
        {
            return true;
        }
    }
}