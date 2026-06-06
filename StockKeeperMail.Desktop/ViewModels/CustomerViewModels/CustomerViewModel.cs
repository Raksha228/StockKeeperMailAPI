using StockKeeperMail.Database.Models;

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
                return string.IsNullOrWhiteSpace(fullName) ? "—" : fullName;
            }
        }
        public string CustomerAddress => _customer?.CustomerAddress ?? string.Empty;
        public string CustomerPhone => _customer?.CustomerPhone ?? string.Empty;
        public string CustomerEmail => _customer?.CustomerEmail ?? string.Empty;

        public string StaffID => _customer?.StaffID.ToString() ?? string.Empty;
        public StaffViewModel Staff => _customer?.Staff == null ? null : new StaffViewModel(_customer.Staff);

        public CustomerViewModel(Customer customer)
        {
            _customer = customer ?? new Customer();
        }
    }
}
