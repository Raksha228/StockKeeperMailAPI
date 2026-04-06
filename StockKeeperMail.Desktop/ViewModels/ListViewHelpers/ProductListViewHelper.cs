using StockKeeperMail.Desktop.ViewModels;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels.ListViewHelpers
{
    /// <summary>
    /// Представляет класс ProductListViewHelper.
    /// </summary>
    public class ProductListViewHelper : ListViewHelperBase<ProductViewModel>
    {
        

        

        public ProductListViewHelper(ObservableCollection<ProductViewModel> databaseCollection, ObservableCollection<ProductViewModel> displayCollection)
            :base(databaseCollection, displayCollection)
        {

        }



        protected override bool FilterCollection(object obj)
        {
            if(obj is ProductViewModel viewModel)
            {
                return viewModel.ProductName.Contains(Filter, StringComparison.InvariantCultureIgnoreCase)
                    || viewModel.ProductSKU.Contains(Filter, StringComparison.InvariantCultureIgnoreCase);
            }
            return false;
        }
    }
}
