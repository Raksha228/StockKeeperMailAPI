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
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы редактирования существующего товара.
    /// Обеспечивает валидацию вводимых данных и сохранение изменений в базе данных.
    /// </summary>
    public class EditProductViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Product _product;

        public string _productName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [MinLength(4, ErrorMessage = "Имя должно содержать не менее 4 символов")]
        [MaxLength(100, ErrorMessage = "Имя должно содержать не более 100 символов")]
        public string ProductName
        {
            get => _productName;
            set
            {
                SetProperty(ref _productName, value, true);
            }
        }

        public string _productSKU;

        [Required(ErrorMessage = "Артикул (SKU) обязателен для заполнения")]
        [MinLength(4, ErrorMessage = "Артикул (SKU) должен содержать не менее 4 символов")]
        [MaxLength(100, ErrorMessage = "Артикул (SKU) должен содержать не более 100 символов")]
        public string ProductSKU
        {
            get => _productSKU;
            set
            {
                SetProperty(ref _productSKU, value, true);
            }
        }

        public string _productUnit;

        [Required(ErrorMessage = "Единица измерения обязательна для заполнения")]
        public string ProductUnit
        {
            get => _productUnit;
            set
            {
                SetProperty(ref _productUnit, value, true);
            }
        }

        public string _productPrice;

        [Required(ErrorMessage = "Цена обязательна для заполнения")]
        [RegularExpression("^[+-]?([0-9]+\\.?[0-9]*|\\.[0-9]+)$", ErrorMessage = "Неверный ввод, допускаются только десятичные числа")]
        public string ProductPrice
        {
            get => _productPrice;
            set
            {
                SetProperty(ref _productPrice, value, true);
            }
        }

        public string _productAvailability;

        [Required(ErrorMessage = "Доступность обязательна для заполнения")]
        public string ProductAvailability
        {
            get => _productAvailability;
            set
            {
                SetProperty(ref _productAvailability, value, true);
            }
        }

        public string _supplierID;

        [Required(ErrorMessage = "Поставщик обязателен для заполнения")]
        public string SupplierID
        {
            get => _supplierID;
            set
            {
                SetProperty(ref _supplierID, value, true);
            }
        }

        public string _categoryID;

        [Required(ErrorMessage = "Категория обязательна для заполнения")]
        public string CategoryID
        {
            get => _categoryID;
            set
            {
                SetProperty(ref _categoryID, value, true);
            }
        }

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly Action _closeDialogCallback;

        private readonly ObservableCollection<CategoryViewModel> _categories;
        private readonly ObservableCollection<SupplierViewModel> _suppliers;
        private readonly ObservableCollection<LocationViewModel> _locations;

        public IEnumerable<SupplierViewModel> Suppliers => _suppliers;
        public IEnumerable<LocationViewModel> Locations => _locations;
        public IEnumerable<CategoryViewModel> Categories => _categories;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        public RelayCommand LoadSuppliersCommand { get; }
        public RelayCommand LoadLocationsCommand { get; }
        public RelayCommand LoadCategoriesCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования товара.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="product">Редактируемый товар.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditProductViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Product product, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;
            _product = product;

            SetInitialValues(_product);

            _suppliers = new ObservableCollection<SupplierViewModel>();
            _categories = new ObservableCollection<CategoryViewModel>();
            _locations = new ObservableCollection<LocationViewModel>();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
            LoadSuppliersCommand = new RelayCommand(LoadSuppliers);
            LoadLocationsCommand = new RelayCommand(LoadLocations);
            LoadCategoriesCommand = new RelayCommand(LoadCategories);
        }

        /// <summary>
        /// Сохраняет изменения товара в базе данных, если валидация пройдена.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            _product.ProductName = _productName;
            _product.ProductSKU = _productSKU;
            _product.ProductUnit = _productUnit;
            _product.ProductPrice = Convert.ToDecimal(_productPrice);
            _product.ProductAvailability = _productAvailability;
            _product.CategoryID = new Guid(_categoryID);
            _product.SupplierID = new Guid(_supplierID);

            _unitOfWork.ProductRepository.Update(_product);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.PRODUCTS, ActionType.UPDATE, $"Product updated; ProductID: {_product.ProductID};"));
            _unitOfWork.Save();

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
        /// Загружает список категорий из базы данных.
        /// </summary>
        private void LoadCategories()
        {
            _categories.Clear();
            foreach (Category c in _unitOfWork.CategoryRepository.Get())
            {
                _categories.Add(new CategoryViewModel(c));
            }
        }

        /// <summary>
        /// Загружает список местоположений (складов) из базы данных.
        /// </summary>
        private void LoadLocations()
        {
            _locations.Clear();
            foreach (Location l in _unitOfWork.LocationRepository.Get())
            {
                _locations.Add(new LocationViewModel(l));
            }
        }

        /// <summary>
        /// Загружает список поставщиков из базы данных.
        /// </summary>
        private void LoadSuppliers()
        {
            _suppliers.Clear();
            foreach (Supplier s in _unitOfWork.SupplierRepository.Get())
            {
                _suppliers.Add(new SupplierViewModel(s));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="product">Редактируемый товар.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditProductViewModel.</returns>
        public static EditProductViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Product product, Action closeDialogCallback)
        {
            EditProductViewModel viewModel = new EditProductViewModel(navigationStore, unitOfWork, product, closeDialogCallback);
            viewModel.LoadLocationsCommand.Execute(null);
            viewModel.LoadSuppliersCommand.Execute(null);
            viewModel.LoadCategoriesCommand.Execute(null);
            return viewModel;
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемого товара.
        /// </summary>
        /// <param name="product">Товар, чьи значения используются.</param>
        private void SetInitialValues(Product product)
        {
            _productName = product.ProductName;
            _productSKU = product.ProductSKU;
            _productUnit = product.ProductUnit.ToString();
            _productPrice = product.ProductPrice.ToString();
            _productAvailability = product.ProductAvailability;
            _supplierID = product.SupplierID.ToString();
            _categoryID = product.CategoryID.ToString();
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