using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Windows;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel формы регистрации прихода товара.
    /// </summary>
    public class CreatePurchaseReceiptViewModel : ViewModelBase
    {
        private bool _isDisposed = false;
        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly Action _closeDialogCallback;
        private readonly List<ProductViewModel> _allProducts;
        private readonly DateTime _purchaseDateTime;

        private string _supplierID;
        [Required(ErrorMessage = "Поставщик обязателен для заполнения")]
        public string SupplierID
        {
            get => _supplierID;
            set
            {
                SetProperty(ref _supplierID, value, true);
                RefreshProductsForSupplier();
            }
        }

        private string _productID;
        [Required(ErrorMessage = "Товар обязателен для заполнения")]
        public string ProductID
        {
            get => _productID;
            set => SetProperty(ref _productID, value, true);
        }

        private string _warehouseID;
        [Required(ErrorMessage = "Склад обязателен для заполнения")]
        public string WarehouseID
        {
            get => _warehouseID;
            set => SetProperty(ref _warehouseID, value, true);
        }

        private string _documentNumber;
        [MaxLength(100, ErrorMessage = "Номер документа должен содержать не более 100 символов")]
        public string DocumentNumber
        {
            get => _documentNumber;
            set => SetProperty(ref _documentNumber, value, true);
        }

        private string _quantity;
        [Required(ErrorMessage = "Количество обязательно для заполнения")]
        [RegularExpression("^[0-9]+$", ErrorMessage = "Количество должно быть целым положительным числом")]
        public string Quantity
        {
            get => _quantity;
            set
            {
                SetProperty(ref _quantity, value, true);
                OnPropertyChanged(nameof(TotalAmountPreview));
            }
        }

        private string _unitPrice;
        [Required(ErrorMessage = "Закупочная цена обязательна для заполнения")]
        [RegularExpression("^[0-9]+([,.][0-9]{1,2})?$", ErrorMessage = "Цена должна быть числом с максимум 2 знаками после запятой")]
        public string UnitPrice
        {
            get => _unitPrice;
            set
            {
                SetProperty(ref _unitPrice, value, true);
                OnPropertyChanged(nameof(TotalAmountPreview));
            }
        }

        private string _comment;
        public string Comment
        {
            get => _comment;
            set => SetProperty(ref _comment, value);
        }

        public string PurchasedAt => _purchaseDateTime.ToString("dd.MM.yyyy HH:mm", new CultureInfo("ru-RU"));
        public string TotalAmountPreview => CalculateTotalPreview();

        private readonly ObservableCollection<SupplierViewModel> _suppliers;
        public IEnumerable<SupplierViewModel> Suppliers => _suppliers;

        private readonly ObservableCollection<ProductViewModel> _products;
        public IEnumerable<ProductViewModel> Products => _products;

        private readonly ObservableCollection<WarehouseViewModel> _warehouses;
        public IEnumerable<WarehouseViewModel> Warehouses => _warehouses;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        public CreatePurchaseReceiptViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;
            _purchaseDateTime = DateTime.Now;

            _suppliers = new ObservableCollection<SupplierViewModel>();
            _products = new ObservableCollection<ProductViewModel>();
            _warehouses = new ObservableCollection<WarehouseViewModel>();
            _allProducts = new List<ProductViewModel>();

            LoadSuppliers();
            LoadProducts();
            LoadWarehouses();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            if (!int.TryParse(_quantity, out int quantity) || quantity < 1)
            {
                MessageBox.Show("Количество должно быть больше 0");
                return;
            }

            if (!TryParseDecimal(_unitPrice, out decimal unitPrice) || unitPrice < 0)
            {
                MessageBox.Show("Закупочная цена указана неверно");
                return;
            }

            Product selectedProduct = _allProducts.SingleOrDefault(p => p.ProductID == _productID)?.Product;
            if (selectedProduct == null)
            {
                MessageBox.Show("Не удалось определить выбранный товар");
                return;
            }

            PurchaseReceipt receipt = new PurchaseReceipt
            {
                PurchaseReceiptID = Guid.NewGuid(),
                SupplierID = new Guid(_supplierID),
                ProductID = new Guid(_productID),
                WarehouseID = new Guid(_warehouseID),
                DocumentNumber = string.IsNullOrWhiteSpace(_documentNumber) ? null : _documentNumber.Trim(),
                Quantity = quantity,
                UnitPrice = unitPrice,
                TotalAmount = quantity * unitPrice,
                PurchasedAt = _purchaseDateTime,
                Comment = string.IsNullOrWhiteSpace(_comment) ? null : _comment.Trim()
            };

            selectedProduct.ProductQuantity += quantity;
            selectedProduct.ProductAvailability = selectedProduct.ProductQuantity > 0 ? "Available" : selectedProduct.ProductAvailability;

            _unitOfWork.PurchaseReceiptRepository.Insert(receipt);
            _unitOfWork.ProductRepository.Update(selectedProduct);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.PURCHASES, ActionType.REGISTER_PURCHASE, $"Purchase receipt registered; PurchaseReceiptID: {receipt.PurchaseReceiptID}; ProductID: {receipt.ProductID}; Quantity: {receipt.Quantity}; WarehouseID: {receipt.WarehouseID};"));
            _unitOfWork.Save();

            MessageBox.Show("Приход товара успешно зарегистрирован");
            _closeDialogCallback();
        }

        private string CalculateTotalPreview()
        {
            if (int.TryParse(_quantity, out int quantity) && TryParseDecimal(_unitPrice, out decimal unitPrice))
            {
                return (quantity * unitPrice).ToString("N2", new CultureInfo("ru-RU"));
            }

            return "0,00";
        }

        private static bool TryParseDecimal(string value, out decimal result)
        {
            result = 0;
            if (string.IsNullOrWhiteSpace(value))
            {
                return false;
            }

            string normalized = value.Trim().Replace(',', '.');
            return decimal.TryParse(normalized, NumberStyles.Number, CultureInfo.InvariantCulture, out result);
        }

        private void Cancel()
        {
            _closeDialogCallback();
        }

        private void LoadSuppliers()
        {
            _suppliers.Clear();
            foreach (Supplier supplier in _unitOfWork.SupplierRepository.Get().OrderBy(s => s.SupplierName))
            {
                _suppliers.Add(new SupplierViewModel(supplier));
            }
        }

        private void LoadProducts()
        {
            _allProducts.Clear();
            foreach (Product product in _unitOfWork.ProductRepository.Get().OrderBy(p => p.ProductName))
            {
                _allProducts.Add(new ProductViewModel(product));
            }

            RefreshProductsForSupplier();
        }

        private void LoadWarehouses()
        {
            _warehouses.Clear();
            foreach (Warehouse warehouse in _unitOfWork.WarehouseRepository.Get().OrderBy(w => w.WarehouseName))
            {
                _warehouses.Add(new WarehouseViewModel(warehouse));
            }
        }

        private void RefreshProductsForSupplier()
        {
            _products.Clear();
            IEnumerable<ProductViewModel> filteredProducts = string.IsNullOrWhiteSpace(_supplierID)
                ? _allProducts
                : _allProducts.Where(p => p.SupplierID == _supplierID);

            foreach (ProductViewModel product in filteredProducts.OrderBy(p => p.ProductName))
            {
                _products.Add(product);
            }

            if (!string.IsNullOrWhiteSpace(_productID) && !_products.Any(p => p.ProductID == _productID))
            {
                ProductID = string.Empty;
            }

            OnPropertyChanged(nameof(Products));
        }

        public static CreatePurchaseReceiptViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            return new CreatePurchaseReceiptViewModel(navigationStore, unitOfWork, closeDialogCallback);
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    // UnitOfWork принадлежит списку приходов, здесь не освобождается.
                }
            }

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}
