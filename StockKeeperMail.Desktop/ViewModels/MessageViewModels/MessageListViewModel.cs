using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс MessageListViewModel.
    /// </summary>
    public class MessageListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private readonly AuthenticationStore _authenticationStore;
        private readonly UnitOfWork _unitOfWork;

        private readonly ObservableCollection<MessageListItemViewModel> _messages;
        public ObservableCollection<MessageListItemViewModel> Messages => _messages;

        private readonly ObservableCollection<MessageUserOptionViewModel> _mailboxUsers;
        public ObservableCollection<MessageUserOptionViewModel> MailboxUsers => _mailboxUsers;

        private List<MessageListItemViewModel> _sourceMessages;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private int _selectedFolderIndex;
        public int SelectedFolderIndex
        {
            get => _selectedFolderIndex;
            set
            {
                if (SetProperty(ref _selectedFolderIndex, value))
                {
                    OnPropertyChanged(nameof(MailboxFilterLabel));
                    LoadMessages();
                }
            }
        }

        private string _selectedMailboxStaffID = string.Empty;
        public string SelectedMailboxStaffID
        {
            get => _selectedMailboxStaffID;
            set
            {
                if (SetProperty(ref _selectedMailboxStaffID, value))
                {
                    ApplyMessagesFilter();
                }
            }
        }

        private MessageListItemViewModel _selectedMessage;
        public MessageListItemViewModel SelectedMessage
        {
            get => _selectedMessage;
            set
            {
                if (SetProperty(ref _selectedMessage, value))
                {
                    MarkSelectedMessageAsRead();
                }
            }
        }

        public string MailboxFilterLabel => SelectedFolderIndex == 0 ? "Отправитель" : "Получатель";

        public RelayCommand LoadMessagesCommand { get; }
        public RelayCommand RefreshMessagesCommand { get; }
        public RelayCommand OpenComposeDialogCommand { get; }

        public MessageListViewModel(AuthenticationStore authenticationStore)
        {
            _authenticationStore = authenticationStore;
            _unitOfWork = new UnitOfWork();

            _messages = new ObservableCollection<MessageListItemViewModel>();
            _mailboxUsers = new ObservableCollection<MessageUserOptionViewModel>();
            _sourceMessages = new List<MessageListItemViewModel>();

            LoadMessagesCommand = new RelayCommand(LoadMessages);
            RefreshMessagesCommand = new RelayCommand(LoadMessages);
            OpenComposeDialogCommand = new RelayCommand(OpenComposeDialog);
        }

        private void OpenComposeDialog()
        {
            string defaultRecipientStaffID = SelectedMessage?.CounterpartyStaffID;

            _dialogViewModel?.Dispose();
            _dialogViewModel = new ComposeMessageViewModel(_unitOfWork, _authenticationStore, CloseDialogCallback, defaultRecipientStaffID);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        private void CloseDialogCallback()
        {
            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));

            LoadMessages();
        }

        private void LoadMessages()
        {
            if (_authenticationStore.CurrentStaff == null)
            {
                return;
            }

            Guid currentStaffID = _authenticationStore.CurrentStaff.StaffID;
            bool isInbox = SelectedFolderIndex == 0;
            string previousFilter = SelectedMailboxStaffID;

            IEnumerable<InternalMessage> rawMessages = isInbox
                ? _unitOfWork.InternalMessageRepository.Get(
                    filter: m => m.RecipientStaffID == currentStaffID,
                    orderBy: q => q.OrderByDescending(m => m.SentAt),
                    includeProperties: "SenderStaff.Role,RecipientStaff.Role")
                : _unitOfWork.InternalMessageRepository.Get(
                    filter: m => m.SenderStaffID == currentStaffID,
                    orderBy: q => q.OrderByDescending(m => m.SentAt),
                    includeProperties: "SenderStaff.Role,RecipientStaff.Role");

            _sourceMessages = rawMessages
                .Select(m => new MessageListItemViewModel(m, isInbox))
                .ToList();

            RefreshMailboxUsers();

            if (!_mailboxUsers.Any(u => u.StaffID == previousFilter))
            {
                previousFilter = string.Empty;
            }

            _selectedMailboxStaffID = previousFilter;
            OnPropertyChanged(nameof(SelectedMailboxStaffID));

            ApplyMessagesFilter();
        }

        private void RefreshMailboxUsers()
        {
            _mailboxUsers.Clear();
            _mailboxUsers.Add(new MessageUserOptionViewModel(string.Empty, "Все пользователи"));

            var options = _sourceMessages
                .GroupBy(m => m.CounterpartyStaffID)
                .Select(g => g.First())
                .OrderBy(m => m.CounterpartyFullName);

            foreach (var item in options)
            {
                string displayName = item.CounterpartyFullName;
                if (!string.IsNullOrWhiteSpace(item.CounterpartyRoleName))
                {
                    displayName += $" ({item.CounterpartyRoleName})";
                }

                _mailboxUsers.Add(new MessageUserOptionViewModel(item.CounterpartyStaffID, displayName));
            }
        }

        private void ApplyMessagesFilter()
        {
            _messages.Clear();

            IEnumerable<MessageListItemViewModel> filtered = _sourceMessages;

            if (!string.IsNullOrWhiteSpace(SelectedMailboxStaffID))
            {
                filtered = filtered.Where(m => m.CounterpartyStaffID == SelectedMailboxStaffID);
            }

            foreach (var message in filtered.OrderByDescending(m => m.SentAt))
            {
                _messages.Add(message);
            }

            SelectedMessage = null;
        }

        private void MarkSelectedMessageAsRead()
        {
            if (SelectedFolderIndex != 0 || SelectedMessage == null || SelectedMessage.IsRead)
            {
                return;
            }

            SelectedMessage.Message.IsRead = true;
            _unitOfWork.InternalMessageRepository.Update(SelectedMessage.Message);
            _unitOfWork.Save();
            SelectedMessage.MarkAsRead();
        }

        public static MessageListViewModel LoadViewModel(NavigationStore navigationStore, AuthenticationStore authenticationStore)
        {
            MessageListViewModel viewModel = new MessageListViewModel(authenticationStore);
            viewModel.LoadMessagesCommand.Execute(null);

            return viewModel;
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    _dialogViewModel?.Dispose();
                    _unitOfWork.Dispose();
                }

                _isDisposed = true;
            }

            base.Dispose(disposing);
        }
    }
}
