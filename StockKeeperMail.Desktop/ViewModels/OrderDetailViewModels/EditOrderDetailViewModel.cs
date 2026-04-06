using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Globalization;
using System.ComponentModel.DataAnnotations;
using System.Windows;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы редактирования детали заказа (изменения количества товара в заказе).
    /// Позволяет изменить количество товара, автоматически пересчитывает сумму и корректирует остатки на складе.
    /// </summary>
    class EditOrderDetailViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly Action _closeDialogCallback;

        private OrderDetail _orderDetail;
        private ProductViewModel _product;

        public ProductViewModel Product => _product;

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

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования детали заказа.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="orderDetail">Редактируемая деталь заказа.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditOrderDetailViewModel(NavigationStore navigationStore, OrderDetail orderDetail, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _closeDialogCallback = closeDialogCallback;

            SetInitialValues(orderDetail);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемой детали заказа.
        /// </summary>
        /// <param name="orderDetail">Деталь заказа, чьи значения используются.</param>
        private void SetInitialValues(OrderDetail orderDetail)
        {
            _orderDetail = orderDetail;
            _product = new ProductViewModel(_orderDetail.Product);
            _orderDetailQuantity = orderDetail.OrderDetailQuantity.ToString();
            _orderDetailAmount = orderDetail.OrderDetailAmount.ToString("0.00", CultureInfo.CurrentCulture);

            OnPropertyChanged(nameof(OrderDetailQuantity));
            OnPropertyChanged(nameof(OrderDetailAmount));
            OnPropertyChanged(nameof(Product));
        }

        /// <summary>
        /// Обновляет отображаемую сумму детали заказа на основе текущего количества.
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
        /// Сохраняет изменения количества товара в заказе.
        /// Корректирует остатки на складе: если количество увеличилось — списывает разницу, если уменьшилось — возвращает.
        /// Если валидация не пройдена или недостаточно товара, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
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

            if (quantity >= _orderDetail.OrderDetailQuantity)
            {
                int addedQuantity = quantity - _orderDetail.OrderDetailQuantity;

                if (addedQuantity > _product.Product.ProductQuantity)
                {
                    MessageBox.Show("Недостаточно товара на складе!");
                    return;
                }

                _orderDetail.Product.ProductQuantity -= addedQuantity;
            }
            else
            {
                _orderDetail.Product.ProductQuantity += _orderDetail.OrderDetailQuantity - quantity;
            }

            _orderDetail.OrderDetailQuantity = quantity;
            _orderDetail.OrderDetailAmount = CalculateAmount();

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет редактирование и закрывает диалог без сохранения изменений.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="orderDetail">Редактируемая деталь заказа.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditOrderDetailViewModel.</returns>
        public static EditOrderDetailViewModel LoadViewModel(NavigationStore navigationStore, OrderDetail orderDetail, Action closeDialogCallback)
        {
            return new EditOrderDetailViewModel(navigationStore, orderDetail, closeDialogCallback);
        }

        /// <summary>
        /// Освобождает ресурсы, используемые ViewModel.
        /// </summary>
        /// <param name="disposing">Указывает, нужно ли освобождать управляемые ресурсы.</param>
        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    _unitOfWork.Dispose();
                }

                _isDisposed = true;
            }

            base.Dispose(disposing);
        }
    }
}