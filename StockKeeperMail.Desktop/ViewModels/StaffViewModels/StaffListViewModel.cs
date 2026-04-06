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
    /// ViewModel для отображения списка сотрудников.
    /// Управляет загрузкой, созданием, редактированием и удалением сотрудников.
    /// </summary>
    public class StaffListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        public StaffListViewHelper StaffListViewHelper { get; }

        private readonly ObservableCollection<StaffViewModel> _staffs;
        public ObservableCollection<StaffViewModel> Staffs { get; }

        public RelayCommand CreateStaffCommand { get; }
        public RelayCommand LoadStaffsCommand { get; }
        public RelayCommand<StaffViewModel> RemoveStaffCommand { get; }
        public RelayCommand<StaffViewModel> EditStaffCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка сотрудников.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public StaffListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            _staffs = new ObservableCollection<StaffViewModel>();
            Staffs = new ObservableCollection<StaffViewModel>();

            StaffListViewHelper = new StaffListViewHelper(_staffs, Staffs);

            LoadStaffsCommand = new RelayCommand(LoadStaffs);
            RemoveStaffCommand = new RelayCommand<StaffViewModel>(RemoveStaff);
            EditStaffCommand = new RelayCommand<StaffViewModel>(EditStaff);
            CreateStaffCommand = new RelayCommand(CreateStaff);
        }

        /// <summary>
        /// Удаляет выбранного сотрудника после подтверждения пользователя.
        /// </summary>
        /// <param name="staffViewModel">ViewModel удаляемого сотрудника.</param>
        private void RemoveStaff(StaffViewModel staffViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.StaffRepository.Delete(staffViewModel.Staff);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.STAFFS, ActionType.DELETE, $"Staff deleted; StaffID:{staffViewModel.StaffID};"));
                _unitOfWork.Save();
                _staffs.Remove(staffViewModel);
                StaffListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Открывает диалог редактирования выбранного сотрудника.
        /// </summary>
        /// <param name="staffViewModel">ViewModel сотрудника для редактирования.</param>
        private void EditStaff(StaffViewModel staffViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditStaffViewModel.LoadViewModel(_navigationStore, _unitOfWork, staffViewModel.Staff, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания нового сотрудника.
        /// </summary>
        private void CreateStaff()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateStaffViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список сотрудников и закрывает диалог.
        /// </summary>
        private void CloseDialogCallback()
        {
            LoadStaffs();

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список всех сотрудников из базы данных вместе с их ролями.
        /// </summary>
        private void LoadStaffs()
        {
            _staffs.Clear();
            foreach (Staff u in _unitOfWork.StaffRepository.Get(includeProperties: "Role"))
            {
                _staffs.Add(new StaffViewModel(u));
            }
            StaffListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр StaffListViewModel.</returns>
        public static StaffListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            StaffListViewModel viewModel = new StaffListViewModel(navigationStore);
            viewModel.LoadStaffsCommand.Execute(null);

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
                    StaffListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}