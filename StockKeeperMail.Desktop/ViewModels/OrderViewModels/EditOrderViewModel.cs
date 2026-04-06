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
    /// ViewModel для формы редактирования существующего заказа.
    /// Позволяет изменять статус доставки, добавлять/удалять товары, корректировать итоговую сумму.
    /// </summary>
    public class EditOrderViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Order _order;

        private CustomerViewModel _customer;

        public CustomerViewModel Customer
        {
            get { return _customer; }
        }

        private readonly string _oldDeliveryStatus;

        private string _deliveryStatus;

        [Required(ErrorMessage = "Статус доставки обязателен для заполнения")]
        public string DeliveryStatus
        {
            get { return _deliveryStatus; }
            set
            {
                SetProperty(ref _deliveryStatus, value, true);
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

        public RelayCommand LoadOrderDetailsCommand { get; }
        public RelayCommand<OrderDetailViewModel> RemoveOrderDetailCommand { get; }
        public RelayCommand<OrderDetailViewModel> EditOrderDetailCommand { get; }
        public RelayCommand CreateOrderDetailCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования заказа.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="orderID">Идентификатор редактируемого заказа.</param>
        public EditOrderViewModel(NavigationStore navigationStore, Guid orderID)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            _order = _unitOfWork.OrderRepository.Get(o => o.OrderID == orderID, includeProperties: "Customer,OrderDetails,OrderDetails.Product").Single();
            _oldDeliveryStatus = _order.DeliveryStatus;

            _customers = new ObservableCollection<CustomerViewModel>();
            LoadCustomers(_customers);

            _orderDetails = new ObservableCollection<OrderDetailViewModel>();
            SetInitialValues(_order);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);

            RemoveOrderDetailCommand = new RelayCommand<OrderDetailViewModel>(RemoveOrderDetail);
            EditOrderDetailCommand = new RelayCommand<OrderDetailViewModel>(EditOrderDetail);
            CreateOrderDetailCommand = new RelayCommand(CreateOrderDetail);
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемого заказа.
        /// </summary>
        /// <param name="order">Заказ, чьи значения используются.</param>
        private void SetInitialValues(Order order)
        {
            _customer = new CustomerViewModel(order.Customer);
            _deliveryStatus = order.DeliveryStatus;
            _orderTotal = order.OrderTotal.ToString();
            _orderDetails.Clear();
            foreach (OrderDetail od in _order.OrderDetails)
            {
                _orderDetails.Add(new OrderDetailViewModel(od));
            }
        }

        /// <summary>
        /// Сохраняет изменения заказа: обновляет статус доставки, итоговую сумму.
        /// Если валидация не пройдена или список товаров пуст, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }
            else if (_orderDetails.Count == 0)
            {
                MessageBox.Show("Список товаров заказа не может быть пустым");
                return;
            }

            _order.DeliveryStatus = _deliveryStatus;
            _order.OrderTotal = _orderDetails.Sum(od => od.OrderDetail.OrderDetailAmount);

            _unitOfWork.OrderRepository.Update(_order);

            if (_deliveryStatus == _oldDeliveryStatus)
            {
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ORDERS, ActionType.DELIVERY_STATUS_CHANGE, $"Delivery Status Changed; OrderID:{_order.OrderID}; DeliverStatus: from {_oldDeliveryStatus} to {_deliveryStatus};"));
            }
            else
            {
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ORDERS, ActionType.UPDATE, $"Order updated; OrderID: {_order.OrderID};"));
            }

            _unitOfWork.Save();

            MessageBox.Show("Успешно");
            CancelCommand.Execute(null);
        }

        /// <summary>
        /// Отменяет редактирование и переходит к списку заказов.
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
            _orderDetails.Remove(orderDetailViewModel);
            _order.OrderDetails.Remove(orderDetailViewModel.OrderDetail);

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

            _orderTotal = _order.OrderDetails.Sum(od => od.OrderDetailAmount).ToString();
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
        /// <param name="customer">Коллекция для загрузки.</param>
        private void LoadCustomers(ObservableCollection<CustomerViewModel> customer)
        {
            customer.Clear();
            foreach (Customer u in _unitOfWork.CustomerRepository.Get())
            {
                customer.Add(new CustomerViewModel(u));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="order">Редактируемый заказ.</param>
        /// <returns>Экземпляр EditOrderViewModel.</returns>
        public static EditOrderViewModel LoadViewModel(NavigationStore navigationStore, Order order)
        {
            EditOrderViewModel viewModel = new EditOrderViewModel(navigationStore, order.OrderID);
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