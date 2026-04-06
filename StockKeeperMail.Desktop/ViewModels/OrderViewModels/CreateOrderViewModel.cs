using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
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
    /// ViewModel для формы создания нового заказа.
    /// Управляет выбором клиента, добавлением товаров в заказ, расчётом итоговой суммы и сохранением заказа.
    /// </summary>
    public class CreateOrderViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Order _order;

        private string _customerID;

        [Required(ErrorMessage = "Клиент обязателен для заполнения")]
        public string CustomerID
        {
            get => _customerID;
            set
            {
                SetProperty(ref _customerID, value);
                _customer = _customers.Where(c => c.CustomerID == _customerID).SingleOrDefault();
            }
        }

        private CustomerViewModel _customer;
        public CustomerViewModel Customer
        {
            set
            {
                SetProperty(ref _customer, value);
            }
        }

        private string _orderTotal;

        [Required(ErrorMessage = "Общая сумма заказа обязательна")]
        public string OrderTotal
        {
            get { return _orderTotal; }
        }

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        private readonly ObservableCollection<OrderDetailViewModel> _orderDetails;
        public IEnumerable<OrderDetailViewModel> OrderDetails => _orderDetails;

        private readonly ObservableCollection<CustomerViewModel> _customers;
        public IEnumerable<CustomerViewModel> Customers => _customers;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        public RelayCommand NavigateToCreateOrderDetailCommand { get; }
        private RelayCommand LoadCustomersCommand { get; }

        public RelayCommand<OrderDetailViewModel> RemoveOrderDetailCommand { get; }
        public RelayCommand<OrderDetailViewModel> EditOrderDetailCommand { get; }
        public RelayCommand CreateOrderDetailCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel создания заказа.
        /// Создаёт временный заказ, загружает список клиентов.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public CreateOrderViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            _customers = new ObservableCollection<CustomerViewModel>();
            LoadCustomers(_customers);

            _order = new Order
            {
                OrderID = Guid.NewGuid(),
                OrderDetails = new List<OrderDetail>()
            };

            _orderDetails = new ObservableCollection<OrderDetailViewModel>();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);

            RemoveOrderDetailCommand = new RelayCommand<OrderDetailViewModel>(RemoveOrderDetail);
            EditOrderDetailCommand = new RelayCommand<OrderDetailViewModel>(EditOrderDetail);
            CreateOrderDetailCommand = new RelayCommand(CreateOrderDetail);
        }

        /// <summary>
        /// Сохраняет заказ: устанавливает клиента, статус, итоговую сумму, дату.
        /// Если валидация не пройдена или список товаров пуст, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }
            else if (_order.OrderDetails.Count == 0)
            {
                MessageBox.Show("Список товаров заказа не может быть пустым");
                return;
            }

            _order.CustomerID = new Guid(CustomerID);
            _order.DeliveryStatus = "Processing";
            _order.OrderTotal = _orderDetails.Sum(od => Convert.ToDecimal(od.OrderDetailAmount));
            _order.OrderDate = DateTime.Now;

            _unitOfWork.OrderRepository.Insert(_order);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ORDERS, ActionType.CREATE, $"New order created; OrderID: {_order.OrderID};"));
            _unitOfWork.Save();

            MessageBox.Show("Успешно");
            CancelCommand.Execute(null);
        }

        /// <summary>
        /// Отменяет создание заказа и переходит к списку заказов.
        /// </summary>
        private void Cancel()
        {
            _navigationStore.CurrentViewModel = OrderListViewModel.LoadViewModel(_navigationStore);
        }

        /// <summary>
        /// Удаляет деталь заказа (товар) из текущего заказа.
        /// </summary>
        /// <param name="orderDetailViewModel">ViewModel удаляемой детали.</param>
        private void RemoveOrderDetail(OrderDetailViewModel orderDetailViewModel)
        {
            _order.OrderDetails.Remove(orderDetailViewModel.OrderDetail);
            _orderDetails.Remove(orderDetailViewModel);

            _orderTotal = _orderDetails.Sum(od => od.OrderDetail.OrderDetailAmount).ToString();
            OnPropertyChanged(nameof(OrderTotal));
        }

        /// <summary>
        /// Открывает диалог редактирования детали заказа.
        /// </summary>
        /// <param name="orderDetailViewModel">ViewModel редактируемой детали.</param>
        private void EditOrderDetail(OrderDetailViewModel orderDetailViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditOrderDetailViewModel.LoadViewModel(_navigationStore, orderDetailViewModel.OrderDetail, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалога.
        /// Обновляет список деталей заказа и итоговую сумму.
        /// </summary>
        private void CloseDialogCallback()
        {
            _orderDetails.Clear();
            foreach (OrderDetail od in _order.OrderDetails)
            {
                _orderDetails.Add(new OrderDetailViewModel(od));
            }

            _orderTotal = _orderDetails.Sum(od => od.OrderDetail.OrderDetailAmount).ToString();
            OnPropertyChanged(nameof(OrderTotal));

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания новой детали заказа (добавления товара).
        /// </summary>
        private void CreateOrderDetail()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateOrderDetailViewModel.LoadViewModel(_navigationStore, _unitOfWork, _order, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список клиентов из базы данных.
        /// </summary>
        /// <param name="customers">Коллекция для загрузки.</param>
        private void LoadCustomers(ObservableCollection<CustomerViewModel> customers)
        {
            customers.Clear();
            foreach (Customer u in _unitOfWork.CustomerRepository.Get())
            {
                customers.Add(new CustomerViewModel(u));
            }
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Экземпляр CreateOrderViewModel.</returns>
        public static CreateOrderViewModel LoadViewModel(NavigationStore navigationStore)
        {
            CreateOrderViewModel viewModel = new CreateOrderViewModel(navigationStore);
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
                    _unitOfWork.Dispose();
                    _dialogViewModel?.Dispose();
                }
                // освобождение неуправляемых ресурсов
            }
            this._isDisposed = true;

            base.Dispose(disposing);
        }
    }
}