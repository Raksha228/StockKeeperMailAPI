using StockKeeperMail.Database.Models;
using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс OrderViewModel.
    /// </summary>
    public class OrderViewModel : ViewModelBase
    {
        private Order _order;
        public Order Order => _order;
        public string OrderID => _order.OrderID.ToString();
        public string CustomerID => _order.CustomerID.ToString();
        public string ExternalOrderNumber => string.IsNullOrWhiteSpace(_order.ExternalOrderNumber) ? "—" : _order.ExternalOrderNumber;
        public string InvoiceOrderNumber => string.IsNullOrWhiteSpace(_order.ExternalOrderNumber) ? _order.OrderID.ToString() : _order.ExternalOrderNumber;
        public string IsOnlineOrderText => _order.IsOnlineOrder ? "Да" : "Нет";
        public string DeliveryAddress => string.IsNullOrWhiteSpace(_order.DeliveryAddress) ? "—" : _order.DeliveryAddress;
        public string OrderDate => _order.OrderDate.ToString("dd.MM.yyyy HH:mm", new CultureInfo("ru-RU"));
        public string OrderTotal => _order.OrderTotal.ToString("N2", new CultureInfo("ru-RU"));
        public string DeliveryStatus => _order.DeliveryStatus;

        public CustomerViewModel Customer
        {
            get
            {
                if (_order.Customer != null)
                {
                    return new CustomerViewModel(_order.Customer);
                }
                return null;
            }
        }

        public OrderViewModel(Order order)
        {
            _order = order;
        }

    }
}
