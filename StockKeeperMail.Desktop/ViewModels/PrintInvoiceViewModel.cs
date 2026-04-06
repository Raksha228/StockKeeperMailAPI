using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.Controls;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using StockKeeperMail.Desktop.Views;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для печати накладной (инвойса) заказа.
    /// Загружает данные заказа и детали, управляет печатью документа.
    /// </summary>
    public class PrintInvoiceViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private OrderViewModel _order;
        public OrderViewModel Order => _order;

        private DateTime _currentDateTime = DateTime.Now;
        public DateTime CurrentDateTime => _currentDateTime;

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;
        private readonly ObservableCollection<OrderDetailViewModel> _orderDetails;
        public IEnumerable<OrderDetailViewModel> OrderDetails => _orderDetails;

        public RelayCommand LoadOrderDetailsCommand { get; }
        public RelayCommand<InvoiceDocumentControl> PrintCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel печати накладной.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="orderID">Идентификатор заказа для печати.</param>
        public PrintInvoiceViewModel(NavigationStore navigationStore, Guid orderID)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            _order = new OrderViewModel(_unitOfWork.OrderRepository.Get(filter: o => o.OrderID == orderID, includeProperties: "Customer,OrderDetails,OrderDetails.Product").SingleOrDefault());

            _orderDetails = new ObservableCollection<OrderDetailViewModel>();

            LoadOrderDetailsCommand = new RelayCommand(LoadOrderDetails);
            PrintCommand = new RelayCommand<InvoiceDocumentControl>(Print);
        }

        /// <summary>
        /// Печатает накладную, используя стандартный диалог печати Windows.
        /// При успешной печати записывает событие в журнал.
        /// </summary>
        /// <param name="userControl">Элемент управления InvoiceDocumentControl, содержащий документ для печати.</param>
        private void Print(InvoiceDocumentControl userControl)
        {
            InvoiceDocumentControl invoiceDocument = (InvoiceDocumentControl)userControl;
            PrintDialog printDialog = new PrintDialog();
            if (printDialog.ShowDialog() == true)
            {
                printDialog.PrintVisual(invoiceDocument, "Печать накладной");
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.ORDERS, ActionType.PRINT_INVOICE, $"Invoice printed; OrderID: {_order.OrderID};"));
                _unitOfWork.Save();
            }
        }

        /// <summary>
        /// Загружает детали заказа для отображения в накладной.
        /// </summary>
        private void LoadOrderDetails()
        {
            _orderDetails.Clear();
            foreach (OrderDetail s in _order.Order.OrderDetails)
            {
                _orderDetails.Add(new OrderDetailViewModel(s));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="orderID">Идентификатор заказа.</param>
        /// <returns>Экземпляр PrintInvoiceViewModel.</returns>
        public static PrintInvoiceViewModel LoadViewModel(NavigationStore navigationStore, Guid orderID)
        {
            PrintInvoiceViewModel viewModel = new PrintInvoiceViewModel(navigationStore, orderID);
            viewModel.LoadOrderDetailsCommand.Execute(null);
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
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}