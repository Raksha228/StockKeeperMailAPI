using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using System.Collections.ObjectModel;
using System.Linq;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для просмотра учетных данных сотрудников.
    /// Раздел доступен пользователям, которым разрешено создавать роли.
    /// </summary>
    public class CredentialListViewModel : ViewModelBase
    {
        private bool _isDisposed;
        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        private readonly ObservableCollection<StaffViewModel> _sourceCredentials;
        public ObservableCollection<StaffViewModel> Credentials { get; }
        public StaffListViewHelper CredentialListViewHelper { get; }

        public RelayCommand LoadCredentialsCommand { get; }

        public CredentialListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            _sourceCredentials = new ObservableCollection<StaffViewModel>();
            Credentials = new ObservableCollection<StaffViewModel>();
            CredentialListViewHelper = new StaffListViewHelper(_sourceCredentials, Credentials);

            LoadCredentialsCommand = new RelayCommand(LoadCredentials);
        }

        private void LoadCredentials()
        {
            _sourceCredentials.Clear();

            foreach (Staff staff in _unitOfWork.StaffRepository.Get(includeProperties: "Role").OrderBy(s => s.StaffLastName).ThenBy(s => s.StaffFirstName))
            {
                _sourceCredentials.Add(new StaffViewModel(staff));
            }

            CredentialListViewHelper.RefreshCollection();
        }

        public static CredentialListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            CredentialListViewModel viewModel = new CredentialListViewModel(navigationStore);
            viewModel.LoadCredentialsCommand.Execute(null);
            return viewModel;
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    _unitOfWork.Dispose();
                    CredentialListViewHelper.Dispose();
                }
            }

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}
