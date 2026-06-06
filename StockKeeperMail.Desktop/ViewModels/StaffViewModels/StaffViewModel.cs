using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс StaffViewModel.
    /// </summary>
    public class StaffViewModel : ViewModelBase
    {
        private readonly Staff _staff;

        public Staff Staff => _staff;
        public string StaffID => _staff?.StaffID.ToString() ?? string.Empty;
        public string RoleID => _staff?.RoleID.ToString() ?? string.Empty;
        public string StaffFirstName => _staff?.StaffFirstName ?? string.Empty;
        public string StaffLastName => _staff?.StaffLastName ?? string.Empty;
        public string StaffFullname
        {
            get
            {
                string fullName = $"{StaffFirstName} {StaffLastName}".Trim();
                return string.IsNullOrWhiteSpace(fullName) ? "—" : fullName;
            }
        }
        public string StaffAddress => _staff?.StaffAddress ?? string.Empty;
        public string StaffPhone => _staff?.StaffPhone ?? string.Empty;
        public string StaffEmail => _staff?.StaffEmail ?? string.Empty;
        public string StaffUsername => _staff?.StaffUsername ?? string.Empty;
        public string StaffPassword => _staff?.StaffPassword ?? string.Empty;

        public RoleViewModel Role => _staff?.Role == null ? null : new RoleViewModel(_staff.Role);

        public StaffViewModel(Staff staff)
        {
            _staff = staff ?? new Staff();
        }
    }
}
