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
    /// ViewModel для отображения списка товаров.
    /// Управляет загрузкой, созданием, редактированием и удалением товаров.
    /// </summary>
    public class ProductListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        public ProductListViewHelper ProductListViewHelper { get; }

        private readonly ObservableCollection<ProductViewModel> _products;
        public ObservableCollection<ProductViewModel> Products { get; }

        public RelayCommand CreateProductCommand { get; }
        public RelayCommand LoadProductsCommand { get; }
        public RelayCommand<ProductViewModel> RemoveProductCommand { get; }
        public RelayCommand<ProductViewModel> EditProductCommand { get; }
        public RelayCommand NavigateToCreateProductCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка товаров.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public ProductListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _products = new ObservableCollection<ProductViewModel>();
            Products = new ObservableCollection<ProductViewModel>();

            ProductListViewHelper = new ProductListViewHelper(_products, Products);

            LoadProductsCommand = new RelayCommand(LoadProducts);
            RemoveProductCommand = new RelayCommand<ProductViewModel>(RemoveProduct);
            EditProductCommand = new RelayCommand<ProductViewModel>(EditProduct);
            CreateProductCommand = new RelayCommand(CreateProduct);
        }

        /// <summary>
        /// Удаляет выбранный товар после подтверждения пользователя.
        /// </summary>
        /// <param name="productViewModel">ViewModel удаляемого товара.</param>
        private void RemoveProduct(ProductViewModel productViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.ProductRepository.Delete(productViewModel.Product);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.PRODUCTS, ActionType.DELETE, $"Product deleted; ProductID:{productViewModel.ProductID};"));
                _unitOfWork.Save();
                _products.Remove(productViewModel);
                ProductListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Открывает диалог редактирования выбранного товара.
        /// </summary>
        /// <param name="productViewModel">ViewModel товара для редактирования.</param>
        private void EditProduct(ProductViewModel productViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditProductViewModel.LoadViewModel(_navigationStore, _unitOfWork, productViewModel.Product, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания нового товара.
        /// </summary>
        private void CreateProduct()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateProductViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список товаров и закрывает диалог.
        /// </summary>
        private void CloseDialogCallback()
        {
            LoadProductsCommand.Execute(null);

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список всех товаров из базы данных вместе с поставщиками и категориями.
        /// </summary>
        private void LoadProducts()
        {
            _products.Clear();
            foreach (Product p in _unitOfWork.ProductRepository.Get(includeProperties: "Supplier,Category"))
            {
                _products.Add(new ProductViewModel(p));
            }
            ProductListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр ProductListViewModel.</returns>
        public static ProductListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            ProductListViewModel viewModel = new ProductListViewModel(navigationStore);
            viewModel.LoadProductsCommand.Execute(null);

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
                    ProductListViewHelper.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}