namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс MessageUserOptionViewModel.
    /// </summary>
    public class MessageUserOptionViewModel
    {
        public string StaffID { get; }

        public string DisplayName { get; }

        public MessageUserOptionViewModel(string staffID, string displayName)
        {
            StaffID = staffID;
            DisplayName = displayName;
        }
    }
}
