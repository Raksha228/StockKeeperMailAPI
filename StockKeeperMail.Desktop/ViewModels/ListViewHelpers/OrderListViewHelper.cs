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
    /// Представляет класс OrderListViewHelper.
    /// </summary>
    public class OrderListViewHelper : ListViewHelperBase<OrderViewModel>
    {
        

        

        public OrderListViewHelper(ObservableCollection<OrderViewModel> databaseCollection, ObservableCollection<OrderViewModel> displayCollection)
            :base(databaseCollection, displayCollection)
        {

        }

        protected override bool FilterCollection(object obj)
        {
            if(obj is OrderViewModel viewModel)
            {
                string filter = Filter ?? string.Empty;
                return (viewModel.Customer?.CustomerFullname?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false)
                    || (viewModel.ExternalOrderNumber?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false)
                    || (viewModel.DeliveryAddress?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false);
            }
            return false;
        }
    }
}
