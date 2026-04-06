using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы редактирования существующей категории.
    /// Обеспечивает валидацию вводимых данных и сохранение изменений в базе данных.
    /// </summary>
    public class EditCategoryViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Category _category;

        public string _categoryName;

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [MinLength(2, ErrorMessage = "Имя должно содержать не менее 2 символов")]
        [MaxLength(50, ErrorMessage = "Имя не может превышать 50 символов")]
        public string CategoryName
        {
            get => _categoryName;
            set
            {
                SetProperty(ref _categoryName, value, true);
            }
        }

        private string _categoryDescription;

        [Required(ErrorMessage = "Описание обязательно для заполнения")]
        [MinLength(10, ErrorMessage = "Описание должно содержать не менее 10 символов")]
        [MaxLength(50, ErrorMessage = "Описание не может превышать 50 символов")]
        public string CategoryDescription
        {
            get => _categoryDescription;
            set
            {
                SetProperty(ref _categoryDescription, value, true);
            }
        }

        private string _categoryStatus;

        [Required(ErrorMessage = "Статус обязателен для заполнения")]
        public string CategoryStatus
        {
            get { return _categoryStatus; }
            set
            {
                SetProperty(ref _categoryStatus, value, true);
            }
        }

        public IEnumerable<string> _statuses;
        public IEnumerable<string> Statuses => _statuses;

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        private readonly Action _closeDialogCallback;
        public RelayCommand SubmitCommand { get; set; }
        public RelayCommand CancelCommand { get; set; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования категории.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="category">Редактируемая категория.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditCategoryViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Category category, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _category = category;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;
            SetInitialValues(_category);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);

            _categoryName = _category.CategoryName;
            _categoryDescription = _category.CategoryDescription;

            CategoryStatus = Constants.Statuses.Where(s => s.Equals(_category.CategoryStatus)).FirstOrDefault();
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемой категории.
        /// </summary>
        /// <param name="category">Категория, чьи значения используются.</param>
        private void SetInitialValues(Category category)
        {
            _categoryName = category.CategoryName;
            _categoryDescription = category.CategoryDescription;
        }

        /// <summary>
        /// Отменяет редактирование и закрывает диалог без сохранения изменений.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Сохраняет изменения категории в базе данных, если валидация пройдена.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            _category.CategoryName = CategoryName;
            _category.CategoryDescription = CategoryDescription;
            _category.CategoryStatus = CategoryStatus;

            _unitOfWork.CategoryRepository.Update(_category);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.CATEGORIES, ActionType.UPDATE, $"Category updated; CategoryID:{_category.CategoryID};"));
            _unitOfWork.Save();

            _closeDialogCallback();
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="category">Редактируемая категория.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditCategoryViewModel.</returns>
        public static EditCategoryViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Category category, Action closeDialogCallback)
        {
            EditCategoryViewModel viewModel = new EditCategoryViewModel(navigationStore, unitOfWork, category, closeDialogCallback);
            return viewModel;
        }

        /// <summary>
        /// Освобождает ресурсы, используемые ViewModel.
        /// </summary>
        /// <param name="disposing">Указывает, нужно ли освобождать управляемые ресурсы.</param>
        protected override void Dispose(bool disposing)
        {
            if (!this._isDisposed)
            {
                if (disposing)
                {
                    // освобождение управляемых ресурсов
                }
                // освобождение неуправляемых ресурсов
            }
            this._isDisposed = true;

            base.Dispose(disposing);
        }
    }
}