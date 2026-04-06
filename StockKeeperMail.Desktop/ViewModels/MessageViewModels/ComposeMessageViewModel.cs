using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Windows;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс ComposeMessageViewModel.
    /// </summary>
    public class ComposeMessageViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private readonly UnitOfWork _unitOfWork;
        private readonly AuthenticationStore _authenticationStore;
        private readonly Action _closeDialogCallback;

        private string _recipientStaffID;

        [Required(ErrorMessage = "Выберите получателя")]
        public string RecipientStaffID
        {
            get => _recipientStaffID;
            set => SetProperty(ref _recipientStaffID, value, true);
        }

        private string _subject;

        [Required(ErrorMessage = "Введите тему письма")]
        [MaxLength(200, ErrorMessage = "Тема письма не должна превышать 200 символов")]
        public string Subject
        {
            get => _subject;
            set => SetProperty(ref _subject, value, true);
        }

        private string _body;

        [Required(ErrorMessage = "Введите текст сообщения")]
        public string Body
        {
            get => _body;
            set => SetProperty(ref _body, value, true);
        }

        private readonly ObservableCollection<MessageUserOptionViewModel> _recipients;
        public ObservableCollection<MessageUserOptionViewModel> Recipients => _recipients;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        public ComposeMessageViewModel(UnitOfWork unitOfWork, AuthenticationStore authenticationStore, Action closeDialogCallback, string defaultRecipientStaffID = null)
        {
            _unitOfWork = unitOfWork;
            _authenticationStore = authenticationStore;
            _closeDialogCallback = closeDialogCallback;
            _recipients = new ObservableCollection<MessageUserOptionViewModel>();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);

            LoadRecipients();
            if (!string.IsNullOrWhiteSpace(defaultRecipientStaffID) && _recipients.Any(r => r.StaffID == defaultRecipientStaffID))
            {
                RecipientStaffID = defaultRecipientStaffID;
            }
        }

        private void LoadRecipients()
        {
            _recipients.Clear();

            var currentStaffID = _authenticationStore.CurrentStaff?.StaffID ?? Guid.Empty;
            var staffs = _unitOfWork.StaffRepository.Get(
                filter: s => s.StaffID != currentStaffID,
                orderBy: q => q.OrderBy(s => s.StaffFirstName).ThenBy(s => s.StaffLastName),
                includeProperties: "Role");

            foreach (var staff in staffs)
            {
                string fullName = $"{staff.StaffFirstName} {staff.StaffLastName}".Trim();
                string displayName = $"{fullName} ({staff.Role?.RoleName ?? "Без должности"})";
                _recipients.Add(new MessageUserOptionViewModel(staff.StaffID.ToString(), displayName));
            }
        }

        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            if (_authenticationStore.CurrentStaff == null)
            {
                return;
            }

            if (RecipientStaffID == _authenticationStore.CurrentStaff.StaffID.ToString())
            {
                MessageBox.Show("Нельзя отправить сообщение самому себе.", "Ошибка", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            InternalMessage newMessage = new InternalMessage
            {
                InternalMessageID = Guid.NewGuid(),
                SenderStaffID = _authenticationStore.CurrentStaff.StaffID,
                RecipientStaffID = new Guid(RecipientStaffID),
                Subject = Subject?.Trim(),
                Body = Body?.Trim(),
                SentAt = DateTime.Now,
                IsRead = false
            };

            _unitOfWork.InternalMessageRepository.Insert(newMessage);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(
                LogCategory.MESSAGES,
                ActionType.SEND,
                $"Internal message sent; MessageID:{newMessage.InternalMessageID}; SenderStaffID:{newMessage.SenderStaffID}; RecipientStaffID:{newMessage.RecipientStaffID};"));
            _unitOfWork.Save();

            _closeDialogCallback?.Invoke();
        }

        private void Cancel()
        {
            _closeDialogCallback?.Invoke();
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                _isDisposed = true;
            }

            base.Dispose(disposing);
        }
    }
}
