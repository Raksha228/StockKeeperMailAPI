using StockKeeperMail.Database.Models;
using System.Globalization;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет строку прихода товара для отображения в списке.
    /// </summary>
    public class PurchaseReceiptViewModel : ViewModelBase
    {
        private readonly PurchaseReceipt _purchaseReceipt;
        private readonly CultureInfo _ruCulture = new CultureInfo("ru-RU");

        public PurchaseReceipt PurchaseReceipt => _purchaseReceipt;
        public string PurchaseReceiptID => _purchaseReceipt?.PurchaseReceiptID.ToString() ?? string.Empty;
        public string DocumentNumber => string.IsNullOrWhiteSpace(_purchaseReceipt?.DocumentNumber) ? "—" : _purchaseReceipt.DocumentNumber;
        public string Quantity => _purchaseReceipt == null ? "0" : _purchaseReceipt.Quantity.ToString("N0", _ruCulture);
        public string UnitPrice => _purchaseReceipt == null ? "0,00" : _purchaseReceipt.UnitPrice.ToString("N2", _ruCulture);
        public string TotalAmount => _purchaseReceipt == null ? "0,00" : _purchaseReceipt.TotalAmount.ToString("N2", _ruCulture);
        public string PurchasedAt => _purchaseReceipt == null ? string.Empty : _purchaseReceipt.PurchasedAt.ToString("dd.MM.yyyy HH:mm", _ruCulture);
        public string Comment => string.IsNullOrWhiteSpace(_purchaseReceipt?.Comment) ? "—" : _purchaseReceipt.Comment;

        public SupplierViewModel Supplier => _purchaseReceipt?.Supplier == null ? null : new SupplierViewModel(_purchaseReceipt.Supplier);
        public ProductViewModel Product => _purchaseReceipt?.Product == null ? null : new ProductViewModel(_purchaseReceipt.Product);
        public WarehouseViewModel Warehouse => _purchaseReceipt?.Warehouse == null ? null : new WarehouseViewModel(_purchaseReceipt.Warehouse);

        public PurchaseReceiptViewModel(PurchaseReceipt purchaseReceipt)
        {
            _purchaseReceipt = purchaseReceipt ?? new PurchaseReceipt();
        }
    }
}
