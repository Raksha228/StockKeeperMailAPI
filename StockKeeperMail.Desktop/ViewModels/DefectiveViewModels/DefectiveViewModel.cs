using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс DefectiveViewModel.
    /// </summary>
    public class DefectiveViewModel : ViewModelBase
    {
        private readonly Defective _defective;
        public Defective Defective => _defective;
        public string DefectiveID => _defective.DefectiveID.ToString();
        public string Quantity => _defective.Quantity.ToString();
        public string DateDeclared => _defective.DateDeclared.ToString();

        public ProductViewModel Product
        {
            get
            {
                if (_defective.Product != null)
                {
                    return new ProductViewModel(_defective.Product);
                }
                return null;
            }
        }




        public DefectiveViewModel(Defective defective)
        {
            _defective = defective;
        }


    }
}
