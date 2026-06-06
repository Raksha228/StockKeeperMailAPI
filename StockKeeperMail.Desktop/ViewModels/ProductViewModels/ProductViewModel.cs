using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс ProductViewModel.
    /// </summary>
    public class ProductViewModel : ViewModelBase
    {
        private readonly Product _product;
        public Product Product => _product;

        public string ProductID => _product?.ProductID.ToString() ?? string.Empty;
        public string SupplierID => _product?.SupplierID.ToString() ?? string.Empty;
        public string CategoryID => _product?.CategoryID.ToString() ?? string.Empty;
        public string ProductName => _product?.ProductName ?? string.Empty;
        public string ProductSKU => _product?.ProductSKU ?? string.Empty;
        public string ProductUnit => _product?.ProductUnit ?? string.Empty;
        public string ProductPrice => _product?.ProductPrice.ToString() ?? "0";
        public string ProductQuantity => _product?.ProductQuantity.ToString() ?? "0";
        public string ProductAvailability => _product?.ProductAvailability ?? string.Empty;

        public SupplierViewModel Supplier => _product?.Supplier == null ? null : new SupplierViewModel(_product.Supplier);
        public CategoryViewModel Category => _product?.Category == null ? null : new CategoryViewModel(_product.Category);

        public ProductViewModel(Product product)
        {
            _product = product ?? new Product();
        }
    }
}
