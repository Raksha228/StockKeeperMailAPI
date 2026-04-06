using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using StockKeeperMail.Desktop.DAL;
using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using System.Windows;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using static StockKeeperMail.Desktop.Utilities.Constants;
using StockKeeperMail.Desktop.Utilities;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка категорий.
    /// Управляет загрузкой, созданием, редактированием и удалением категорий.
    /// </summary>
    public class CategoryListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;

        public bool IsDialogOpen
        {
            get { return _isDialogOpen; }
        }

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private readonly ObservableCollection<CategoryViewModel> _categories;
        public ObservableCollection<CategoryViewModel> Categories { get; }

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;


        public CategoryListViewHelper CategoryListViewHelper { get; }

        public RelayCommand LoadCategoriesCommand { get; }
        public RelayCommand<CategoryViewModel> RemoveCategoryCommand { get; }
        public RelayCommand<CategoryViewModel> EditCategoryCommand { get; }
        public RelayCommand CreateCategoryCommand { get; }


        public CategoryListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _categories = new ObservableCollection<CategoryViewModel>();
            Categories = new ObservableCollection<CategoryViewModel>();
            CategoryListViewHelper = new CategoryListViewHelper(_categories, Categories);
            LoadCategoriesCommand = new RelayCommand(LoadCategories);
            RemoveCategoryCommand = new RelayCommand<CategoryViewModel>(RemoveCategory);
            EditCategoryCommand = new RelayCommand<CategoryViewModel>(EditCategory);
            CreateCategoryCommand = new RelayCommand(CreateCategory);
        }

        /// <summary>
        /// Удаляет выбранную категорию после подтверждения пользователя.
        /// </summary>
        /// <param name="categoryViewModel">ViewModel удаляемой категории.</param>
        public void RemoveCategory(CategoryViewModel categoryViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.CategoryRepository.Delete(categoryViewModel.Category);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.CATEGORIES, ActionType.DELETE, $"Category deleted; CategoryID:{categoryViewModel.CategoryID};"));
                _unitOfWork.Save();
                _categories.Remove(categoryViewModel);

                CategoryListViewHelper.RefreshCollection();
                MessageBox.Show("Категория успешно удалена");
            }
        }

        /// <summary>
        /// Открывает диалог редактирования выбранной категории.
        /// </summary>
        /// <param name="categoryViewModel">ViewModel категории для редактирования.</param>
        public void EditCategory(CategoryViewModel categoryViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditCategoryViewModel.LoadViewModel(_navigationStore, _unitOfWork, categoryViewModel.Category, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания новой категории.
        /// </summary>
        public void CreateCategory()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateCategoryViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список всех категорий из базы данных.
        /// </summary>
        public void LoadCategories()
        {
            _categories.Clear();
            foreach (Category c in _unitOfWork.CategoryRepository.Get())
            {
                _categories.Add(new CategoryViewModel(c));
            }
            CategoryListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр CategoryListViewModel.</returns>
        public static CategoryListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            CategoryListViewModel viewModel = new CategoryListViewModel(navigationStore);
            viewModel.LoadCategoriesCommand.Execute(null);
            return viewModel;
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список категорий и закрывает диалог.
        /// </summary>
        public void CloseDialogCallback()
        {
            LoadCategoriesCommand.Execute(null);

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Освобождает ресурсы, используемые ViewModel.
        /// </summary>
        /// <param name="disposing">Указывает, нужно ли освобождать управляемые ресурсы.</param>
        protected override void Dispose(bool disposing)
        {
            // Примечание: реализуйте финализатор только если объект содержит неуправляемые ресурсы

            if (!this._isDisposed)
            {
                if (disposing) // освобождаем все неуправляемые и управляемые ресурсы
                {
                    // освобождение ресурсов
                    _unitOfWork.Dispose();
                    _dialogViewModel?.Dispose();
                    CategoryListViewHelper?.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}