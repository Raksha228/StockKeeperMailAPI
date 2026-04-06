using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы получения товара со склада.
    /// Позволяет указать количество товара для изъятия, проверяет его наличие и обновляет остатки.
    /// Поддерживает два режима: для заказа (не уменьшает общий остаток товара) и обычный.
    /// </summary>
    class GetProductViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private ProductLocation _productLocation;

        private bool _isForOrder = false;

        /// <summary>
        /// Указывает, выполняется ли операция в рамках заказа.
        /// Если true, общий остаток товара не уменьшается.
        /// </summary>
        public bool IsForOrder
        {
            get => _isForOrder;
            set
            {
                SetProperty(ref _isForOrder, value);
            }
        }

        public ProductViewModel Product => new ProductViewModel(_productLocation.Product);

        public string _productQuantity;

        [Required(ErrorMessage = "Количество обязательно для заполнения")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Неверный формат ввода")]
        public string ProductQuantity
        {
            get { return _productQuantity; }
            set { SetProperty(ref _productQuantity, value, true); }
        }

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        private Action _closeDialogCallback;

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel получения товара.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="productLocation">Местоположение товара на складе.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public GetProductViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _productLocation = productLocation;
            _closeDialogCallback = closeDialogCallback;

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Выполняет списание товара со склада: уменьшает количество в локации.
        /// Если операция не для заказа, также уменьшает общий остаток товара.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();
            if (HasErrors)
            {
                return;
            }
            else if (Convert.ToInt32(_productQuantity) < 1)
            {
                MessageBox.Show("Разрешено только количество больше 0");
                return;
            }
            else if (Convert.ToInt32(_productQuantity) > _productLocation.ProductQuantity)
            {
                MessageBox.Show($"Количество превышает доступный запас. В наличии только {_productLocation.ProductQuantity} единиц.");
                return;
            }

            _productLocation.ProductQuantity -= Convert.ToInt32(_productQuantity);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.STORAGES, ActionType.GET, $"Product taken; ProductID: {_productLocation.ProductID}; Quantity: {_productQuantity};"));

            if (!_isForOrder)
            {
                _productLocation.Product.ProductQuantity -= Convert.ToInt32(_productQuantity);
            }

            _unitOfWork.Save();
            MessageBox.Show("Успешно");
            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет операцию и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="productLocation">Местоположение товара на складе.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр GetProductViewModel.</returns>
        public static GetProductViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            GetProductViewModel viewModel = new GetProductViewModel(navigationStore, unitOfWork, productLocation, closeDialogCallback);
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
                }
                // освобождение неуправляемых ресурсов
            }
            this._isDisposed = true;

            base.Dispose(disposing);
        }
    }
}