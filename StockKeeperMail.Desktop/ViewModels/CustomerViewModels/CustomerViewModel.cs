using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс CustomerViewModel.
    /// </summary>
    public class CustomerViewModel : ViewModelBase
    {
        private readonly Customer _customer;
        public Customer Customer => _customer;

        public string CustomerID => _customer?.CustomerID.ToString() ?? string.Empty;
        public string CustomerFirstname => _customer?.CustomerFirstname ?? string.Empty;
        public string CustomerLastname => _customer?.CustomerLastname ?? string.Empty;
        public string CustomerFullname
        {
            get
            {
                string fullName = $"{CustomerFirstname} {CustomerLastname}".Trim();
                return string.IsNullOrWhiteSpace(fullName) ? "Неизвестный покупатель" : fullName;
            }
        }
        public string CustomerAddress => _customer?.CustomerAddress ?? string.Empty;
        public string CustomerPhone => _customer?.CustomerPhone ?? string.Empty;
        public string CustomerEmail => _customer?.CustomerEmail ?? string.Empty;

        public string StaffID => _customer?.StaffID.ToString() ?? string.Empty;
        public StaffViewModel Staff
        {
            get
            {
                if(_customer?.Staff != null)
                {
                    return new StaffViewModel(_customer.Staff);
                }
                return null;
            }
        }

        public CustomerViewModel(Customer customer)
        {
            _customer = customer ?? new Customer
            {
                CustomerFirstname = "Неизвестный",
                CustomerLastname = "покупатель",
                CustomerAddress = string.Empty,
                CustomerPhone = string.Empty,
                CustomerEmail = string.Empty
            };
        }
    }
}
