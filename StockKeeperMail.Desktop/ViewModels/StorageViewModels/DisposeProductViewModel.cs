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
    /// ViewModel для формы списания товара со склада.
    /// Позволяет указать количество товара для списания, проверяет его наличие и обновляет остатки.
    /// </summary>
    class DisposeProductViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private ProductLocation _productLocation;

        public ProductViewModel Product => new ProductViewModel(_productLocation.Product);

        public string _disposeQuantity;

        [Required(ErrorMessage = "Количество обязательно для заполнения")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Неверный формат ввода")]
        public string DisposeQuantity
        {
            get { return _disposeQuantity; }
            set { SetProperty(ref _disposeQuantity, value, true); }
        }

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        private Action _closeDialogCallback;

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списания товара.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="productLocation">Местоположение товара на складе.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public DisposeProductViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _productLocation = productLocation;
            _closeDialogCallback = closeDialogCallback;

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Выполняет списание товара: уменьшает количество в локации и общий остаток товара.
        /// Если валидация не пройдена или количество превышает доступное, списание не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();
            if (HasErrors)
            {
                return;
            }
            else if (Convert.ToInt32(_disposeQuantity) < 1)
            {
                MessageBox.Show("Разрешено только количество больше 0");
                return;
            }
            else if (Convert.ToInt32(_disposeQuantity) > _productLocation.ProductQuantity)
            {
                MessageBox.Show($"Количество превышает доступный запас. В наличии только {_productLocation.ProductQuantity}.");
                return;
            }

            _productLocation.ProductQuantity -= Convert.ToInt32(_disposeQuantity);
            _productLocation.Product.ProductQuantity -= Convert.ToInt32(_disposeQuantity);

            _unitOfWork.ProductLocationRepository.Update(_productLocation);
            _unitOfWork.ProductRepository.Update(_productLocation.Product);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.STORAGES, ActionType.DISPOSE, $"Product disposed; ProductID: {_productLocation.ProductID}; Quantity: {_disposeQuantity};"));
            _unitOfWork.Save();

            MessageBox.Show("Успешно");
            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет списание и закрывает диалог.
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
        /// <returns>Экземпляр DisposeProductViewModel.</returns>
        public static DisposeProductViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            DisposeProductViewModel viewModel = new DisposeProductViewModel(navigationStore, unitOfWork, productLocation, closeDialogCallback);
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