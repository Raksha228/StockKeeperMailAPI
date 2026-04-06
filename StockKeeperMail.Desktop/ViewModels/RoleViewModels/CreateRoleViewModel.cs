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
    /// ViewModel для формы создания новой роли.
    /// Обеспечивает валидацию вводимых данных, управление привилегиями и сохранение роли в базе данных.
    /// </summary>
    public class CreateRoleViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

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
        [MaxLength(100, ErrorMessage = "Описание не может превышать 100 символов")]
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
        /// Инициализирует новый экземпляр ViewModel создания роли.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateRoleViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            RolePrivilegesHelper = new RolePrivilegesHelper();

            _closeDialogCallback = closeDialogCallback;
            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Отправляет данные формы, создаёт новую роль с выбранными привилегиями и сохраняет в базе данных.
        /// Если валидация не пройдена, сохранение не выполняется.
        /// </summary>
        public void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            Role newRole = new Role
            {
                RoleID = Guid.NewGuid(),
                RoleName = this.RoleName,
                RoleDescription = this.RoleDescription,
                RoleStatus = this.RoleStatus,

                OrdersView = RolePrivilegesHelper.OrdersView,
                OrdersAdd = RolePrivilegesHelper.OrdersAdd,
                OrdersEdit = RolePrivilegesHelper.OrdersEdit,
                OrdersDelete = RolePrivilegesHelper.OrdersDelete,

                CustomersView = RolePrivilegesHelper.CustomersView,
                CustomersAdd = RolePrivilegesHelper.CustomersAdd,
                CustomersEdit = RolePrivilegesHelper.CustomersEdit,
                CustomersDelete = RolePrivilegesHelper.CustomersDelete,

                ProductsView = RolePrivilegesHelper.ProductsView,
                ProductsAdd = RolePrivilegesHelper.ProductsAdd,
                ProductsEdit = RolePrivilegesHelper.ProductsEdit,
                ProductsDelete = RolePrivilegesHelper.ProductsDelete,

                StoragesView = RolePrivilegesHelper.StoragesView,
                StoragesAdd = RolePrivilegesHelper.StoragesAdd,
                StoragesEdit = RolePrivilegesHelper.StoragesEdit,
                StoragesDelete = RolePrivilegesHelper.StoragesDelete,

                DefectivesView = RolePrivilegesHelper.DefectivesView,
                DefectivesAdd = RolePrivilegesHelper.DefectivesAdd,
                DefectivesEdit = RolePrivilegesHelper.DefectivesEdit,
                DefectivesDelete = RolePrivilegesHelper.DefectivesDelete,

                CategoriesView = RolePrivilegesHelper.CategoriesView,
                CategoriesAdd = RolePrivilegesHelper.CategoriesAdd,
                CategoriesEdit = RolePrivilegesHelper.CategoriesEdit,
                CategoriesDelete = RolePrivilegesHelper.CategoriesDelete,

                LocationsView = RolePrivilegesHelper.LocationsView,
                LocationsAdd = RolePrivilegesHelper.LocationsAdd,
                LocationsEdit = RolePrivilegesHelper.LocationsEdit,
                LocationsDelete = RolePrivilegesHelper.LocationsDelete,

                SuppliersView = RolePrivilegesHelper.SuppliersView,
                SuppliersAdd = RolePrivilegesHelper.SuppliersAdd,
                SuppliersEdit = RolePrivilegesHelper.SuppliersEdit,
                SuppliersDelete = RolePrivilegesHelper.SuppliersDelete,

                RolesView = RolePrivilegesHelper.RolesView,
                RolesAdd = RolePrivilegesHelper.RolesAdd,
                RolesEdit = RolePrivilegesHelper.RolesEdit,
                RolesDelete = RolePrivilegesHelper.RolesDelete,

                StaffsView = RolePrivilegesHelper.StaffsView,
                StaffsAdd = RolePrivilegesHelper.StaffsAdd,
                StaffsEdit = RolePrivilegesHelper.StaffsEdit,
                StaffsDelete = RolePrivilegesHelper.StaffsDelete,

                LogsView = RolePrivilegesHelper.LogsView,
                LogsAdd = RolePrivilegesHelper.LogsAdd,
                LogsEdit = RolePrivilegesHelper.LogsEdit,
                LogsDelete = RolePrivilegesHelper.LogsDelete
            };

            _unitOfWork.RoleRepository.Insert(newRole);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ROLES, ActionType.CREATE, $"New role created; RoleID:{newRole.RoleID};"));
            _unitOfWork.Save();

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет создание роли и закрывает диалог.
        /// </summary>
        public void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр CreateRoleViewModel.</returns>
        public static CreateRoleViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            return new CreateRoleViewModel(navigationStore, unitOfWork, closeDialogCallback);
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
    }
}