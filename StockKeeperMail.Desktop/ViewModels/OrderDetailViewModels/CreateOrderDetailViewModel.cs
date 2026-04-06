using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Windows;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы создания детали заказа (добавления товара в заказ).
    /// Управляет выбором товара, количеством, автоматическим расчётом суммы и проверкой остатков на складе.
    /// </summary>
    class CreateOrderDetailViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private readonly Order _order;
        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly ObservableCollection<ProductViewModel> _products;
        private readonly Action _closeDialogCallback;

        private string _productID;

        [Required(ErrorMessage = "Товар обязателен для заполнения")]
        public string ProductID
        {
            get => _productID;
            set
            {
                if (SetProperty(ref _productID, value, true))
                {
                    if (!string.IsNullOrWhiteSpace(_productID))
                    {
                        Product = Products.SingleOrDefault(p => p.ProductID == _productID);
                    }
                    else
                    {
                        Product = null;
                    }

                    UpdateOrderDetailAmount();
                }
            }
        }

        private ProductViewModel _product;
        public ProductViewModel Product
        {
            get => _product;
            set
            {
                if (SetProperty(ref _product, value))
                {
                    UpdateOrderDetailAmount();
                }
            }
        }

        private string _orderDetailQuantity = "0";

        [Required(ErrorMessage = "Количество обязательно для заполнения")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Неверный формат (допустимы только цифры)")]
        public string OrderDetailQuantity
        {
            get => _orderDetailQuantity;
            set
            {
                if (SetProperty(ref _orderDetailQuantity, value, true))
                {
                    UpdateOrderDetailAmount();
                }
            }
        }

        private string _orderDetailAmount = "0,00";
        public string OrderDetailAmount => _orderDetailAmount;

        public IEnumerable<ProductViewModel> Products => _products;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel создания детали заказа.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Единица работы, используемая для текущего заказа.</param>
        /// <param name="order">Заказ, для которого добавляется товар.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateOrderDetailViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Order order, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _order = order;
            _closeDialogCallback = closeDialogCallback;

            _products = new ObservableCollection<ProductViewModel>();
            LoadProducts(_products);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);

            UpdateOrderDetailAmount();
        }

        /// <summary>
        /// Обновляет отображаемую сумму детали заказа на основе выбранного товара и количества.
        /// </summary>
        private void UpdateOrderDetailAmount()
        {
            decimal amount = CalculateAmount();
            SetProperty(ref _orderDetailAmount, amount.ToString("0.00", CultureInfo.CurrentCulture), false, nameof(OrderDetailAmount));
        }

        /// <summary>
        /// Рассчитывает сумму детали заказа.
        /// </summary>
        /// <returns>Сумма = цена товара × количество.</returns>
        private decimal CalculateAmount()
        {
            if (_product == null)
            {
                return 0m;
            }

            if (!int.TryParse(_orderDetailQuantity, out int quantity))
            {
                return 0m;
            }

            if (quantity < 0)
            {
                return 0m;
            }

            return _product.Product.ProductPrice * quantity;
        }

        /// <summary>
        /// Отправляет данные формы, добавляет или обновляет деталь заказа, корректирует остатки на складе.
        /// Если валидация не пройдена или недостаточно товара, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            if (_product == null)
            {
                MessageBox.Show("Пожалуйста, выберите товар.");
                return;
            }

            if (!int.TryParse(_orderDetailQuantity, out int quantity))
            {
                MessageBox.Show("Неверное количество.");
                return;
            }

            if (quantity < 1)
            {
                MessageBox.Show("Разрешено только количество больше 0");
                return;
            }

            Product storedProduct = _unitOfWork.ProductRepository.GetByID(_product.Product.ProductID);

            if (storedProduct == null)
            {
                MessageBox.Show("Товар не найден.");
                return;
            }

            if (quantity > storedProduct.ProductQuantity)
            {
                MessageBox.Show("Недостаточно товара на складе!");
                return;
            }

            decimal calculatedAmount = CalculateAmount();

            OrderDetail storedOrderDetail = _order.OrderDetails.SingleOrDefault(od => od.ProductID == storedProduct.ProductID);

            if (storedOrderDetail == null)
            {
                OrderDetail newOrderDetail = new OrderDetail()
                {
                    OrderID = _order.OrderID,
                    Product = storedProduct,
                    ProductID = storedProduct.ProductID,
                    OrderDetailQuantity = quantity,
                    OrderDetailAmount = calculatedAmount
                };

                storedProduct.ProductQuantity -= newOrderDetail.OrderDetailQuantity;
                _order.OrderDetails.Add(newOrderDetail);
            }
            else
            {
                storedOrderDetail.OrderDetailQuantity += quantity;
                storedOrderDetail.OrderDetailAmount = storedOrderDetail.OrderDetailQuantity * storedProduct.ProductPrice;
                storedOrderDetail.Product = storedProduct;
                storedProduct.ProductQuantity -= quantity;
            }

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет добавление товара и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Загружает список доступных товаров (со статусом "Available").
        /// </summary>
        /// <param name="products">Коллекция, в которую добавляются загруженные товары.</param>
        private void LoadProducts(ObservableCollection<ProductViewModel> products)
        {
            products.Clear();

            foreach (Product p in _unitOfWork.ProductRepository.Get(filter: p => p.ProductAvailability == "Available"))
            {
                products.Add(new ProductViewModel(p));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Единица работы, используемая для текущего заказа.</param>
        /// <param name="order">Заказ, для которого добавляется товар.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр CreateOrderDetailViewModel.</returns>
        public static CreateOrderDetailViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Order order, Action closeDialogCallback)
        {
            return new CreateOrderDetailViewModel(navigationStore, unitOfWork, order, closeDialogCallback);
        }

        /// <summary>
        /// Освобождает ресурсы, используемые ViewModel.
        /// </summary>
        /// <param name="disposing">Указывает, нужно ли освобождать управляемые ресурсы.</param>
        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                _isDisposed = true;
            }

            base.Dispose(disposing);
        }
    }
}