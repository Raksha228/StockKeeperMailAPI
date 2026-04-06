using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы создания новой категории.
    /// Обеспечивает валидацию вводимых данных и сохранение категории в базу данных.
    /// </summary>
    public class CreateCategoryViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

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

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;

        private readonly Action _closeDialogCallback;
        public ICommand SubmitCommand { get; set; }
        public ICommand CancelCommand { get; set; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel создания категории.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateCategoryViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            _unitOfWork = unitOfWork;
            _navigationStore = navigationStore;
            _closeDialogCallback = closeDialogCallback;
            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Отправляет данные формы, создаёт новую категорию и сохраняет её в базе данных.
        /// Если валидация не пройдена, сохранение не выполняется.
        /// </summary>
        public void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }

            Category newCategory = new Category()
            {
                CategoryID = Guid.NewGuid(),
                CategoryName = CategoryName,
                CategoryDescription = CategoryDescription,
                CategoryStatus = CategoryStatus
            };

            _unitOfWork.CategoryRepository.Insert(newCategory);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.CATEGORIES, ActionType.CREATE, $"New category created; CategoryID:{newCategory.CategoryID};"));
            _unitOfWork.Save();
            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет создание категории и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр CreateCategoryViewModel.</returns>
        public static CreateCategoryViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            return new CreateCategoryViewModel(navigationStore, unitOfWork, closeDialogCallback);
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