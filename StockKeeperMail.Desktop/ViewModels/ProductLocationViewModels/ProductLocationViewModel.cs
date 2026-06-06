using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс ProductLocationViewModel.
    /// </summary>
    public class ProductLocationViewModel
    {
        private readonly ProductLocation _productLocation;

        public ProductLocationViewModel(ProductLocation productLocation)
        {
            _productLocation = productLocation ?? new ProductLocation();
        }

        public ProductLocation ProductLocation => _productLocation;
        public string ProductID => _productLocation?.ProductID.ToString() ?? string.Empty;
        public string LocationID => _productLocation?.LocationID.ToString() ?? string.Empty;
        public string ProductQuantity => _productLocation?.ProductQuantity.ToString() ?? "0";

        public ProductViewModel Product => _productLocation?.Product == null ? null : new ProductViewModel(_productLocation.Product);
        public LocationViewModel Location => _productLocation?.Location == null ? null : new LocationViewModel(_productLocation.Location);
    }
}
