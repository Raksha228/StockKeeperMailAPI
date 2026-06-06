using StockKeeperMail.Desktop.ViewModels;
using System;
using System.Collections.ObjectModel;

namespace StockKeeperMail.Desktop.ViewModels.ListViewHelpers
{
    /// <summary>
    /// Фильтрация и пагинация списка приходов товара.
    /// </summary>
    public class PurchaseReceiptListViewHelper : ListViewHelperBase<PurchaseReceiptViewModel>
    {
        public PurchaseReceiptListViewHelper(ObservableCollection<PurchaseReceiptViewModel> databaseCollection, ObservableCollection<PurchaseReceiptViewModel> displayCollection)
            : base(databaseCollection, displayCollection)
        {
        }

        protected override bool FilterCollection(object obj)
        {
            if (obj is PurchaseReceiptViewModel viewModel)
            {
                string filter = Filter ?? string.Empty;
                return (viewModel.DocumentNumber?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false)
                    || (viewModel.Supplier?.SupplierName?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false)
                    || (viewModel.Product?.ProductName?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false)
                    || (viewModel.Warehouse?.WarehouseName?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false)
                    || (viewModel.PurchasedAt?.Contains(filter, StringComparison.InvariantCultureIgnoreCase) ?? false);
            }

            return false;
        }
    }
}
