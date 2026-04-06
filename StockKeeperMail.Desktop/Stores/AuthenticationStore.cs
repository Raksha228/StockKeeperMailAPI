using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.Stores
{
    /// <summary>
    /// Представляет класс AuthenticationStore.
    /// </summary>
    public class AuthenticationStore
    {
        private Staff _currentStaff;
        public Staff CurrentStaff 
        { 
            get { return _currentStaff; } 
            set 
            {
                _currentStaff = value;
                OnIsCurrentStaffChanged();
            } 
        } 


        private bool _isLoggedIn = false;

        public bool IsLoggedIn
        {
            get => _isLoggedIn;
            set
            {
                _isLoggedIn = value;
                OnIsLoggedInChanged();
            }
        }

        public event Action IsLoggedInChanged;

        private void OnIsLoggedInChanged()
        {
            IsLoggedInChanged?.Invoke();
        }

        public event Action IsCurrentStaffChanged;

        private void OnIsCurrentStaffChanged()
        {
            IsCurrentStaffChanged?.Invoke();
        }


    }
}
