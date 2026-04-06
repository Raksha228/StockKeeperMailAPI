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
    /// ViewModel для формы создания нового товара.
    /// Обеспечивает валидацию вводимых данных и сохранение товара в базу данных.
    /// </summary>
    public class CreateProductViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

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
        public IEnumerable<CategoryViewModel> Categories => _categories;

        private readonly ObservableCollection<LocationViewModel> _locations;
        public IEnumerable<LocationViewModel> Locations => _locations;

        private readonly ObservableCollection<SupplierViewModel> _suppliers;
        public IEnumerable<SupplierViewModel> Suppliers => _suppliers;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        private RelayCommand LoadSuppliersCommand { get; }
        private RelayCommand LoadCategoriesCommand { get; }
        private RelayCommand LoadLocationsCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel создания товара.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateProductViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;

            _suppliers = new ObservableCollection<SupplierViewModel>();
            _locations = new ObservableCollection<LocationViewModel>();
            _categories = new ObservableCollection<CategoryViewModel>();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);

            LoadLocationsCommand = new RelayCommand(LoadLocations);
            LoadSuppliersCommand = new RelayCommand(LoadSuppliers);
            LoadCategoriesCommand = new RelayCommand(LoadCategories);
        }

        /// <summary>
        /// Отправляет данные формы, создаёт новый товар и сохраняет его в базе данных.
        /// Если валидация не пройдена, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            Product newProduct = new Product()
            {
                ProductID = Guid.NewGuid(),
                ProductName = _productName,
                ProductSKU = _productSKU,
                ProductQuantity = 0,
                ProductUnit = _productUnit,
                ProductPrice = Convert.ToDecimal(_productPrice),
                ProductAvailability = _productAvailability,
                SupplierID = new Guid(_supplierID),
                CategoryID = new Guid(_categoryID)
            };

            _unitOfWork.ProductRepository.Insert(newProduct);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.PRODUCTS, ActionType.CREATE, $"New product created; ProductID: {newProduct.ProductID};"));
            _unitOfWork.Save();

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет создание товара и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Загружает список активных поставщиков из базы данных.
        /// </summary>
        private void LoadSuppliers()
        {
            _suppliers.Clear();
            foreach (Supplier s in _unitOfWork.SupplierRepository.Get(filter: s => s.SupplierStatus == "Active"))
            {
                _suppliers.Add(new SupplierViewModel(s));
            }
        }

        /// <summary>
        /// Загружает список местоположений (складов) из базы данных.
        /// </summary>
        private void LoadLocations()
        {
            _locations.Clear();
            foreach (Location s in _unitOfWork.LocationRepository.Get())
            {
                _locations.Add(new LocationViewModel(s));
            }
        }

        /// <summary>
        /// Загружает список активных категорий из базы данных.
        /// </summary>
        private void LoadCategories()
        {
            _categories.Clear();
            foreach (Category c in _unitOfWork.CategoryRepository.Get(filter: c => c.CategoryStatus == "Active"))
            {
                _categories.Add(new CategoryViewModel(c));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр CreateProductViewModel.</returns>
        public static CreateProductViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            CreateProductViewModel viewModel = new CreateProductViewModel(navigationStore, unitOfWork, closeDialogCallback);
            viewModel.LoadLocationsCommand.Execute(null);
            viewModel.LoadSuppliersCommand.Execute(null);
            viewModel.LoadCategoriesCommand.Execute(null);
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

        /// <summary>
        /// Проверяет, можно ли создать товар (всегда true).
        /// </summary>
        /// <param name="obj">Параметр команды.</param>
        /// <returns>Всегда true.</returns>
        public bool CanCreateProduct(object obj)
        {
            return true;
        }
    }
}