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
    /// ViewModel для формы добавления товара на склад (в локацию).
    /// Позволяет выбрать товар, указать количество и добавить его к выбранной локации.
    /// </summary>
    class CreateProductLocationViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Location _location;

        private string _productID;

        [Required(ErrorMessage = "Товар обязателен для заполнения")]
        public string ProductID
        {
            get { return _productID; }
            set
            {
                SetProperty(ref _productID, value, true);
            }
        }

        private string _productQuantity;

        [Required(ErrorMessage = "Количество обязательно для заполнения")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Неверный формат (допустимы только цифры)")]
        public string ProductQuantity
        {
            get { return _productQuantity; }
            set { SetProperty(ref _productQuantity, value, true); }
        }

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        private readonly ObservableCollection<ProductViewModel> _products;
        public IEnumerable<ProductViewModel> Products => _products;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        private RelayCommand LoadProductsCommand { get; }
        private Action _closeDialogCallback;

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel добавления товара в локацию.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="location">Локация (склад), в которую добавляется товар.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateProductLocationViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Location location, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _location = location;
            _closeDialogCallback = closeDialogCallback;
            _products = new ObservableCollection<ProductViewModel>();
            LoadProducts(_products);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Добавляет выбранное количество товара в локацию.
        /// Если товар уже есть в локации — увеличивает его количество, иначе создаёт новую запись.
        /// Также увеличивает общее количество товара на складе.
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

            ProductLocation productLocation = _location.ProductLocations.SingleOrDefault(od => od.ProductID.ToString() == _productID);
            if (productLocation == null)
            {
                Product selectedProduct = _products.SingleOrDefault(p => p.ProductID == _productID)?.Product;

                if (selectedProduct == null)
                {
                    MessageBox.Show("Не удалось определить выбранный товар.");
                    return;
                }

                ProductLocation newProductLocation = new ProductLocation()
                {
                    LocationID = _location.LocationID,
                    ProductID = new Guid(_productID),
                    ProductQuantity = Convert.ToInt32(_productQuantity),
                    Product = selectedProduct,
                    Location = _location
                };

                _unitOfWork.ProductLocationRepository.Insert(newProductLocation);
                _location.ProductLocations.Add(newProductLocation);
            }
            else
            {
                productLocation.ProductQuantity += Convert.ToInt32(_productQuantity);
                _unitOfWork.ProductLocationRepository.Update(productLocation);
            }

            Product updatedProduct = _products.SingleOrDefault(p => p.ProductID == _productID).Product;
            updatedProduct.ProductQuantity += Convert.ToInt32(_productQuantity);

            _unitOfWork.ProductRepository.Update(updatedProduct);



            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.STORAGES, ActionType.ADD_STOCK, $"Product stocks added to location; locationID: {_location.LocationID}; ProductID: {_productID};"));
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
        /// Загружает список всех товаров из базы данных.
        /// </summary>
        /// <param name="products">Коллекция для загрузки.</param>
        private void LoadProducts(ObservableCollection<ProductViewModel> products)
        {
            products.Clear();
            foreach (Product p in _unitOfWork.ProductRepository.Get())
            {
                products.Add(new ProductViewModel(p));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="location">Локация (склад).</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр CreateProductLocationViewModel.</returns>
        public static CreateProductLocationViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Location location, Action closeDialogCallback)
        {
            CreateProductLocationViewModel viewModel = new CreateProductLocationViewModel(navigationStore, unitOfWork, location, closeDialogCallback);
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