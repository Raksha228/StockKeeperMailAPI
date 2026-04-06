using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка ролей.
    /// Управляет загрузкой, созданием, редактированием и удалением ролей.
    /// </summary>
    public class RoleListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        public RoleListViewHelper RoleListViewHelper { get; }

        private readonly ObservableCollection<RoleViewModel> _roles;
        public ObservableCollection<RoleViewModel> Roles { get; }

        public RelayCommand LoadRolesCommand { get; }
        public RelayCommand CreateRoleCommand { get; }
        public RelayCommand<RoleViewModel> EditRoleCommand { get; }
        public RelayCommand<RoleViewModel> RemoveRoleCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка ролей.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public RoleListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            _roles = new ObservableCollection<RoleViewModel>();
            Roles = new ObservableCollection<RoleViewModel>();

            RoleListViewHelper = new RoleListViewHelper(_roles, Roles);

            LoadRolesCommand = new RelayCommand(LoadData);
            RemoveRoleCommand = new RelayCommand<RoleViewModel>(RemoveRole);
            CreateRoleCommand = new RelayCommand(CreateRole);
            EditRoleCommand = new RelayCommand<RoleViewModel>(EditRole);
        }

        /// <summary>
        /// Открывает диалог редактирования выбранной роли.
        /// </summary>
        /// <param name="roleViewModel">ViewModel роли для редактирования.</param>
        public void EditRole(RoleViewModel roleViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditRoleViewModel.LoadViewModel(_navigationStore, _unitOfWork, roleViewModel.Role, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания новой роли.
        /// </summary>
        public void CreateRole()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateRoleViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Удаляет выбранную роль после подтверждения пользователя.
        /// </summary>
        /// <param name="roleViewModel">ViewModel удаляемой роли.</param>
        public void RemoveRole(RoleViewModel roleViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.RoleRepository.Delete(roleViewModel.Role);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ROLES, ActionType.DELETE, $"Role deleted; RoleID:{roleViewModel.RoleID};"));
                _unitOfWork.Save();
                _roles.Remove(roleViewModel);
                RoleListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Загружает список всех ролей из базы данных.
        /// </summary>
        public void LoadData()
        {
            _roles.Clear();
            foreach (Role r in _unitOfWork.RoleRepository.Get())
            {
                _roles.Add(new RoleViewModel(r));
            }
            RoleListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список ролей и закрывает диалог.
        /// </summary>
        private void CloseDialogCallback()
        {
            LoadRolesCommand.Execute(null);

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр RoleListViewModel.</returns>
        public static RoleListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            RoleListViewModel viewModel = new RoleListViewModel(navigationStore);
            viewModel.LoadRolesCommand.Execute(null);
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
                    RoleListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}