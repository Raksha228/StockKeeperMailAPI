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
    /// Представляет класс StorageDetailListViewHelper.
    /// </summary>
    public class StorageDetailListViewHelper : ListViewHelperBase<ProductLocationViewModel>
    {
        

        

        public StorageDetailListViewHelper(ObservableCollection<ProductLocationViewModel> databaseCollection, ObservableCollection<ProductLocationViewModel> displayCollection)
            :base(databaseCollection, displayCollection)
        {

        }



        protected override bool FilterCollection(object obj)
        {
            if (obj is not ProductLocationViewModel viewModel)
            {
                return false;
            }

            if (string.IsNullOrWhiteSpace(Filter))
            {
                return true;
            }

            string productName = viewModel.Product?.ProductName ?? string.Empty;
            return productName.Contains(Filter, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
