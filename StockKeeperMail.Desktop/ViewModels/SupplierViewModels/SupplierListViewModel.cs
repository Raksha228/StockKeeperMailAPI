using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка поставщиков.
    /// Управляет загрузкой, созданием, редактированием и удалением поставщиков.
    /// </summary>
    public class SupplierListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        private readonly ObservableCollection<SupplierViewModel> _suppliers;
        public ObservableCollection<SupplierViewModel> Suppliers { get; }

        public SupplierListViewHelper SupplierListViewHelper { get; }

        public ICommand ToCreateSupplierCommand { get; }
        public RelayCommand LoadSuppliersCommand { get; }
        public RelayCommand<SupplierViewModel> RemoveSupplierCommand { get; }
        public RelayCommand<SupplierViewModel> EditSupplierCommand { get; }
        public RelayCommand CreateSupplierCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка поставщиков.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public SupplierListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _suppliers = new ObservableCollection<SupplierViewModel>();
            Suppliers = new ObservableCollection<SupplierViewModel>();
            SupplierListViewHelper = new SupplierListViewHelper(_suppliers, Suppliers);

            LoadSuppliersCommand = new RelayCommand(LoadSuppliers);
            RemoveSupplierCommand = new RelayCommand<SupplierViewModel>(RemoveSupplier);
            EditSupplierCommand = new RelayCommand<SupplierViewModel>(EditSupplier);
            CreateSupplierCommand = new RelayCommand(CreateSupplier);
        }

        /// <summary>
        /// Удаляет выбранного поставщика после подтверждения пользователя.
        /// </summary>
        /// <param name="supplierViewModel">ViewModel удаляемого поставщика.</param>
        private void RemoveSupplier(SupplierViewModel supplierViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.SupplierRepository.Delete(supplierViewModel.Supplier);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.SUPPLIERS, ActionType.DELETE, $"Supplier deleted; SupplierID:{supplierViewModel.SupplierID};"));
                _unitOfWork.Save();
                _suppliers.Remove(supplierViewModel);
                SupplierListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Открывает диалог создания нового поставщика.
        /// </summary>
        private void CreateSupplier()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateSupplierViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог редактирования выбранного поставщика.
        /// </summary>
        /// <param name="supplierViewModel">ViewModel поставщика для редактирования.</param>
        private void EditSupplier(SupplierViewModel supplierViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditSupplierViewModel.LoadViewModel(_navigationStore, _unitOfWork, supplierViewModel.Supplier, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список поставщиков и закрывает диалог.
        /// </summary>
        private void CloseDialogCallback()
        {
            LoadSuppliersCommand.Execute(null);

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список всех поставщиков из базы данных.
        /// </summary>
        private void LoadSuppliers()
        {
            _suppliers.Clear();
            foreach (Supplier s in _unitOfWork.SupplierRepository.Get())
            {
                _suppliers.Add(new SupplierViewModel(s));
            }
            SupplierListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр SupplierListViewModel.</returns>
        public static SupplierListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            SupplierListViewModel viewModel = new SupplierListViewModel(navigationStore);
            viewModel.LoadSuppliersCommand.Execute(null);
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
                    SupplierListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}