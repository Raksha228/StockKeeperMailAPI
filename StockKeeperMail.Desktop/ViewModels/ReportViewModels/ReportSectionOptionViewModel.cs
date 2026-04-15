using StockKeeperMail.Desktop.Services.Reports;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Элемент выбора раздела отчета.
    /// </summary>
    public class ReportSectionOptionViewModel : ViewModelBase
    {
        private bool _isSelected;

        public ReportSectionKey SectionKey { get; }
        public string DisplayName { get; }
        public bool IsAvailable { get; }

        public bool IsSelected
        {
            get => _isSelected;
            set => SetProperty(ref _isSelected, value);
        }

        public ReportSectionOptionViewModel(ReportSectionKey sectionKey, string displayName, bool isAvailable)
        {
            SectionKey = sectionKey;
            DisplayName = displayName;
            IsAvailable = isAvailable;
            _isSelected = isAvailable;
        }
    }
}
