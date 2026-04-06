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
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка клиентов.
    /// Управляет загрузкой, созданием, редактированием и удалением клиентов.
    /// </summary>
    class CustomerListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        public CustomerListViewHelper CustomerListViewHelper { get; }

        private readonly ObservableCollection<CustomerViewModel> _customers;
        public ObservableCollection<CustomerViewModel> Customers { get; }

        public RelayCommand CreateCustomerCommand { get; }
        public RelayCommand LoadCustomersCommand { get; }
        public RelayCommand<CustomerViewModel> RemoveCustomerCommand { get; }
        public RelayCommand<CustomerViewModel> EditCustomerCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка клиентов.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public CustomerListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _customers = new ObservableCollection<CustomerViewModel>();
            Customers = new ObservableCollection<CustomerViewModel>();

            CustomerListViewHelper = new CustomerListViewHelper(_customers, Customers);

            LoadCustomersCommand = new RelayCommand(LoadCustomers);
            RemoveCustomerCommand = new RelayCommand<CustomerViewModel>(RemoveCustomer);
            EditCustomerCommand = new RelayCommand<CustomerViewModel>(EditCustomer);
            CreateCustomerCommand = new RelayCommand(CreateCustomer);
        }

        /// <summary>
        /// Удаляет выбранного клиента после подтверждения пользователя.
        /// </summary>
        /// <param name="customerViewModel">ViewModel удаляемого клиента.</param>
        private void RemoveCustomer(CustomerViewModel customerViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.CustomerRepository.Delete(customerViewModel.Customer);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.CUSTOMERS, ActionType.DELETE, $"Customer deleted; CustomerID:{customerViewModel.CustomerID};"));
                _unitOfWork.Save();
                _customers.Remove(customerViewModel);
                CustomerListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Открывает диалог редактирования выбранного клиента.
        /// </summary>
        /// <param name="customerViewModel">ViewModel клиента для редактирования.</param>
        private void EditCustomer(CustomerViewModel customerViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditCustomerViewModel.LoadViewModel(_navigationStore, _unitOfWork, customerViewModel.Customer, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания нового клиента.
        /// </summary>
        private void CreateCustomer()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateCustomerViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список клиентов и закрывает диалог.
        /// </summary>
        private void CloseDialogCallback()
        {
            LoadCustomersCommand.Execute(null);

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список всех клиентов из базы данных.
        /// </summary>
        private void LoadCustomers()
        {
            _customers.Clear();
            foreach (Customer u in _unitOfWork.CustomerRepository.Get(includeProperties: "Staff"))
            {
                _customers.Add(new CustomerViewModel(u));
            }
            CustomerListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр CustomerListViewModel.</returns>
        public static CustomerListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            CustomerListViewModel viewModel = new CustomerListViewModel(navigationStore);
            viewModel.LoadCustomersCommand.Execute(null);

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
                    CustomerListViewHelper?.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}