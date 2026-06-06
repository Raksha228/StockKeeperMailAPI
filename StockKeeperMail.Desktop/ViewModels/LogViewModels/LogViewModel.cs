using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс LogViewModel.
    /// </summary>
    public class LogViewModel : ViewModelBase
    {
        private readonly Log _log;
        public Log Log => _log;

        public string LogID => _log?.LogID.ToString() ?? string.Empty;
        public string StaffName
        {
            get
            {
                if (_log?.Staff == null)
                {
                    return "—";
                }

                string fullName = $"{_log.Staff.StaffFirstName} {_log.Staff.StaffLastName}".Trim();
                return string.IsNullOrWhiteSpace(fullName) ? "—" : fullName;
            }
        }
        public string LogCategory => _log?.LogCategory ?? string.Empty;
        public string ActionType => _log?.ActionType ?? string.Empty;
        public string LogDetails => _log?.LogDetails ?? string.Empty;
        public string DateTime => _log?.DateTime.ToString() ?? string.Empty;

        public LogViewModel(Log log)
        {
            _log = log ?? new Log();
        }
    }
}
