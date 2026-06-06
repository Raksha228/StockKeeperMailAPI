using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel списка приходов товара.
    /// </summary>
    public class PurchaseReceiptListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;
        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly ObservableCollection<PurchaseReceiptViewModel> _purchaseReceipts;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        public ObservableCollection<PurchaseReceiptViewModel> PurchaseReceipts { get; }
        public PurchaseReceiptListViewHelper PurchaseReceiptListViewHelper { get; }

        public RelayCommand LoadPurchaseReceiptsCommand { get; }
        public RelayCommand CreatePurchaseReceiptCommand { get; }

        public PurchaseReceiptListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _purchaseReceipts = new ObservableCollection<PurchaseReceiptViewModel>();
            PurchaseReceipts = new ObservableCollection<PurchaseReceiptViewModel>();
            PurchaseReceiptListViewHelper = new PurchaseReceiptListViewHelper(_purchaseReceipts, PurchaseReceipts);

            LoadPurchaseReceiptsCommand = new RelayCommand(LoadPurchaseReceipts);
            CreatePurchaseReceiptCommand = new RelayCommand(CreatePurchaseReceipt);
        }

        private void CreatePurchaseReceipt()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreatePurchaseReceiptViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        private void CloseDialogCallback()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = null;
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));

            LoadPurchaseReceipts();
        }

        private void LoadPurchaseReceipts()
        {
            _purchaseReceipts.Clear();
            foreach (PurchaseReceipt receipt in _unitOfWork.PurchaseReceiptRepository
                .Get()
                .OrderByDescending(r => r.PurchasedAt))
            {
                _purchaseReceipts.Add(new PurchaseReceiptViewModel(receipt));
            }

            PurchaseReceiptListViewHelper.RefreshCollection();
        }

        public static PurchaseReceiptListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            PurchaseReceiptListViewModel viewModel = new PurchaseReceiptListViewModel(navigationStore);
            viewModel.LoadPurchaseReceiptsCommand.Execute(null);
            return viewModel;
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    _unitOfWork.Dispose();
                    _dialogViewModel?.Dispose();
                    PurchaseReceiptListViewHelper.Dispose();
                }
            }

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}
