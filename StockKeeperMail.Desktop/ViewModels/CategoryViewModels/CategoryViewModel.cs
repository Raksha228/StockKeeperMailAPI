using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс CategoryViewModel.
    /// </summary>
    public class CategoryViewModel : ViewModelBase
    {
        private readonly Category _category;
        public Category Category => _category;
        public string CategoryID => _category.CategoryID.ToString();
        public string CategoryName => _category.CategoryName;
        public string CategoryDescription => _category.CategoryDescription;
        public string CategoryStatus => _category.CategoryStatus;

        public CategoryViewModel(Category category)
        {
            _category = category;
        }
    }
}
