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
    /// ViewModel для отображения списка заказов.
    /// Управляет загрузкой, созданием, редактированием, удалением заказов и печатью накладных.
    /// </summary>
    public class OrderListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        public OrderListViewHelper OrderListViewHelper { get; }

        private readonly ObservableCollection<OrderViewModel> _orders;
        public ObservableCollection<OrderViewModel> Orders { get; }

        public RelayCommand<OrderViewModel> CreateOrderCommand { get; }
        public RelayCommand LoadOrdersCommand { get; }
        public RelayCommand<OrderViewModel> RemoveOrderCommand { get; }
        public RelayCommand<OrderViewModel> EditOrderCommand { get; }
        public RelayCommand<OrderViewModel> PrintInvoiceCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка заказов.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public OrderListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _orders = new ObservableCollection<OrderViewModel>();
            Orders = new ObservableCollection<OrderViewModel>();

            OrderListViewHelper = new OrderListViewHelper(_orders, Orders);

            LoadOrdersCommand = new RelayCommand(LoadOrders);
            CreateOrderCommand = new RelayCommand<OrderViewModel>(CreateOrder);
            RemoveOrderCommand = new RelayCommand<OrderViewModel>(RemoveOrder);
            EditOrderCommand = new RelayCommand<OrderViewModel>(EditOrder);
            PrintInvoiceCommand = new RelayCommand<OrderViewModel>(PrintInvoice);
        }

        /// <summary>
        /// Открывает диалог печати накладной для выбранного заказа.
        /// </summary>
        /// <param name="orderViewModel">ViewModel заказа.</param>
        private void PrintInvoice(OrderViewModel orderViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = PrintInvoiceViewModel.LoadViewModel(_navigationStore, orderViewModel.Order.OrderID);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Удаляет выбранный заказ после подтверждения пользователя.
        /// </summary>
        /// <param name="orderViewModel">ViewModel удаляемого заказа.</param>
        private void RemoveOrder(OrderViewModel orderViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.OrderRepository.Delete(orderViewModel.Order);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ORDERS, ActionType.DELETE, $"Order deleted; OrderID:{orderViewModel.OrderID};"));
                _unitOfWork.Save();
                _orders.Remove(orderViewModel);
                OrderListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Открывает форму редактирования выбранного заказа.
        /// </summary>
        /// <param name="orderViewModel">ViewModel редактируемого заказа.</param>
        private void EditOrder(OrderViewModel orderViewModel)
        {
            _navigationStore.CurrentViewModel = EditOrderViewModel.LoadViewModel(_navigationStore, orderViewModel.Order);
        }

        /// <summary>
        /// Открывает форму создания нового заказа.
        /// </summary>
        /// <param name="orderViewModel">Не используется.</param>
        private void CreateOrder(OrderViewModel orderViewModel)
        {
            _navigationStore.CurrentViewModel = CreateOrderViewModel.LoadViewModel(_navigationStore);
        }

        /// <summary>
        /// Загружает список заказов из базы данных вместе с информацией о клиентах.
        /// </summary>
        private void LoadOrders()
        {
            _orders.Clear();
            foreach (Order o in _unitOfWork.OrderRepository.Get(includeProperties: "Customer"))
            {
                _orders.Add(new OrderViewModel(o));
            }
            OrderListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр OrderListViewModel.</returns>
        public static OrderListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            OrderListViewModel viewModel = new OrderListViewModel(navigationStore);
            viewModel.LoadOrdersCommand.Execute(null);

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
                    OrderListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}