using StockKeeperMail.Database.Models;
using System;
using System.Windows;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс MessageListItemViewModel.
    /// </summary>
    public class MessageListItemViewModel : ViewModelBase
    {
        private readonly InternalMessage _message;
        private readonly bool _isInboxView;

        public InternalMessage Message => _message;
        public string InternalMessageID => _message.InternalMessageID.ToString();
        public string Subject => string.IsNullOrWhiteSpace(_message.Subject) ? "(без темы)" : _message.Subject;
        public string Body => _message.Body ?? string.Empty;
        public DateTime SentAt => _message.SentAt;
        public string SentAtDisplay => _message.SentAt.ToString("dd.MM.yyyy HH:mm");
        public bool IsRead => _message.IsRead;
        public FontWeight RowFontWeight => _message.IsRead ? FontWeights.Normal : FontWeights.Bold;

        public string SenderFullName => BuildFullName(_message.SenderStaff);
        public string SenderRoleName => _message.SenderStaff?.Role?.RoleName ?? string.Empty;
        public string SenderUsername => _message.SenderStaff?.StaffUsername ?? string.Empty;

        public string RecipientFullName => BuildFullName(_message.RecipientStaff);
        public string RecipientRoleName => _message.RecipientStaff?.Role?.RoleName ?? string.Empty;
        public string RecipientUsername => _message.RecipientStaff?.StaffUsername ?? string.Empty;

        public string CounterpartyStaffID => _isInboxView
            ? _message.SenderStaffID.ToString()
            : _message.RecipientStaffID.ToString();

        public string CounterpartyFullName => _isInboxView ? SenderFullName : RecipientFullName;

        public string CounterpartyRoleName => _isInboxView ? SenderRoleName : RecipientRoleName;

        public string CounterpartyUsername => _isInboxView ? SenderUsername : RecipientUsername;

        public MessageListItemViewModel(InternalMessage message, bool isInboxView)
        {
            _message = message;
            _isInboxView = isInboxView;
        }

        public void MarkAsRead()
        {
            _message.IsRead = true;
            OnPropertyChanged(nameof(IsRead));
            OnPropertyChanged(nameof(RowFontWeight));
        }

        private static string BuildFullName(Staff staff)
        {
            if (staff == null)
            {
                return string.Empty;
            }

            return $"{staff.StaffFirstName} {staff.StaffLastName}".Trim();
        }
    }
}
