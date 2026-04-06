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
    /// Представляет класс LocationListViewHelper.
    /// </summary>
    public class LocationListViewHelper : ListViewHelperBase<LocationViewModel>
    {
        

        

        public LocationListViewHelper(ObservableCollection<LocationViewModel> databaseCollection, ObservableCollection<LocationViewModel> displayCollection)
            :base(databaseCollection, displayCollection)
        {

        }



        protected override bool FilterCollection(object obj)
        {
            if(obj is LocationViewModel viewModel)
            {
                return viewModel.LocationName.Contains(Filter, StringComparison.InvariantCultureIgnoreCase);
            }
            return false;
        }
    }
}
