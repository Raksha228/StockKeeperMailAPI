using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.Utilities
{
    /// <summary>
    /// Представляет класс LogUtil.
    /// </summary>
    public static class LogUtil
    {
        public static Log CreateLog(LogCategory logCategory, ActionType actionType, string details)
        {
            Log newLog = new Log
            {
                LogID = Guid.NewGuid(),
                StaffID = ((MainViewModel)Application.Current.MainWindow.DataContext).AuthenticationStore.CurrentStaff.StaffID,
                LogCategory = logCategory.ToString(),
                ActionType = actionType.ToString(),
                LogDetails = details,
                DateTime = DateTime.Now
            };

            return newLog;
        }
    }
}
