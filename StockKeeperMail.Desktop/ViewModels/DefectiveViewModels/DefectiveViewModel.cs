using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс DefectiveViewModel.
    /// </summary>
    public class DefectiveViewModel : ViewModelBase
    {
        private readonly Defective _defective;
        public Defective Defective => _defective;

        public string DefectiveID => _defective?.DefectiveID.ToString() ?? string.Empty;
        public string Quantity => _defective?.Quantity.ToString() ?? "0";
        public string DateDeclared => _defective?.DateDeclared.ToString() ?? string.Empty;

        public ProductViewModel Product => _defective?.Product == null ? null : new ProductViewModel(_defective.Product);

        public DefectiveViewModel(Defective defective)
        {
            _defective = defective ?? new Defective();
        }
    }
}
