using StockKeeperMail.Database.Models;
using System.Globalization;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс OrderViewModel.
    /// </summary>
    public class OrderViewModel : ViewModelBase
    {
        private readonly Order _order;
        private readonly CultureInfo _ruCulture = new CultureInfo("ru-RU");

        public Order Order => _order;
        public string OrderID => _order?.OrderID.ToString() ?? string.Empty;
        public string CustomerID => _order?.CustomerID.ToString() ?? string.Empty;
        public string ExternalOrderNumber => string.IsNullOrWhiteSpace(_order?.ExternalOrderNumber) ? "—" : _order.ExternalOrderNumber;
        public string InvoiceOrderNumber => string.IsNullOrWhiteSpace(_order?.ExternalOrderNumber) ? OrderID : _order.ExternalOrderNumber;
        public string IsOnlineOrderText => _order?.IsOnlineOrder == true ? "Да" : "Нет";
        public string DeliveryAddress => string.IsNullOrWhiteSpace(_order?.DeliveryAddress) ? "—" : _order.DeliveryAddress;
        public string OrderDate => _order == null ? string.Empty : _order.OrderDate.ToString("dd.MM.yyyy HH:mm", _ruCulture);
        public string OrderTotal => _order == null ? "0,00" : _order.OrderTotal.ToString("N2", _ruCulture);
        public string DeliveryStatus => _order?.DeliveryStatus ?? string.Empty;

        public CustomerViewModel Customer => _order?.Customer == null ? null : new CustomerViewModel(_order.Customer);

        public OrderViewModel(Order order)
        {
            _order = order ?? new Order();
        }
    }
}
