using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Desktop.ViewModels;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace StockKeeperMail.Desktop.ViewModels.ListViewHelpers
{
    /// <summary>
    /// Базовый абстрактный класс для вспомогательных объектов работы со списками.
    /// Обеспечивает пагинацию, фильтрацию и отображение коллекции.
    /// </summary>
    /// <typeparam name="TViewModel">Тип ViewModel элементов списка.</typeparam>
    public abstract class ListViewHelperBase<TViewModel> : ViewModelBase
    {
        private bool _isDisposed = false;

        private int _currentPage = 1;

        /// <summary>
        /// Текущая страница (начиная с 1).
        /// </summary>
        public int CurrentPage
        {
            get { return _currentPage; }
            set
            {
                SetProperty(ref _currentPage, value);
            }
        }

        private int _numberOfPages = 1;

        /// <summary>
        /// Общее количество страниц.
        /// </summary>
        public int NumberOfPages
        {
            get { return _numberOfPages; }
            set
            {
                SetProperty(ref _numberOfPages, value);
            }
        }

        private int _selectedRecordsPerPage = 10;

        /// <summary>
        /// Количество записей, отображаемых на одной странице.
        /// </summary>
        public int SelectedRecordsPerPage
        {
            get { return _selectedRecordsPerPage; }
            set
            {
                SetProperty(ref _selectedRecordsPerPage, value);
                UpdateRecordsPerPage();
            }
        }

        private string _filter = string.Empty;

        /// <summary>
        /// Строка фильтрации элементов списка.
        /// </summary>
        public string Filter
        {
            get { return _filter; }
            set
            {
                SetProperty(ref _filter, value);
                _collectionView.Refresh();
                RefreshCollection();
            }
        }

        private readonly ObservableCollection<TViewModel> _databaseCollection;
        private ICollectionView _collectionView;
        public readonly ObservableCollection<TViewModel> DisplayCollection;

        /// <summary>
        /// Команда перехода на следующую страницу.
        /// </summary>
        public RelayCommand NextPageCommand { get; }
        /// <summary>
        /// Команда перехода на предыдущую страницу.
        /// </summary>
        public RelayCommand PreviousPageCommand { get; }
        /// <summary>
        /// Команда перехода на первую страницу.
        /// </summary>
        public RelayCommand FirstPageCommand { get; }
        /// <summary>
        /// Команда перехода на последнюю страницу.
        /// </summary>
        public RelayCommand LastPageCommand { get; }

        private IEnumerable<int> _recordsPerPage = new List<int> { 10, 20, 30 };
        /// <summary>
        /// Доступные варианты количества записей на странице.
        /// </summary>
        public IEnumerable<int> RecordsPerPage => _recordsPerPage;

        /// <summary>
        /// Инициализирует новый экземпляр вспомогательного класса для работы со списком.
        /// </summary>
        /// <param name="databaseCollection">Исходная коллекция (из базы данных).</param>
        /// <param name="displayCollection">Коллекция для отображения (с учётом пагинации).</param>
        public ListViewHelperBase(ObservableCollection<TViewModel> databaseCollection, ObservableCollection<TViewModel> displayCollection)
        {
            _databaseCollection = databaseCollection;
            _collectionView = CollectionViewSource.GetDefaultView(databaseCollection);
            _collectionView.Filter = FilterCollection;
            DisplayCollection = displayCollection;

            NextPageCommand = new RelayCommand(NextPage, () => CurrentPage < NumberOfPages);
            PreviousPageCommand = new RelayCommand(PreviousPage, () => CurrentPage > 1);
            FirstPageCommand = new RelayCommand(FirstPage, () => CurrentPage > 1);
            LastPageCommand = new RelayCommand(LastPage, () => CurrentPage < NumberOfPages);
        }

        /// <summary>
        /// Метод фильтрации элемента. Должен быть реализован в производных классах.
        /// </summary>
        /// <param name="obj">Объект для проверки.</param>
        /// <returns>true, если элемент проходит фильтр; иначе false.</returns>
        protected abstract bool FilterCollection(object obj);

        /// <summary>
        /// Обновляет количество страниц на основе выбранного количества записей.
        /// </summary>
        private void UpdateRecordsPerPage()
        {
            NumberOfPages = Convert.ToInt32(Math.Ceiling(Convert.ToDouble(_collectionView.Cast<TViewModel>().Count()) / SelectedRecordsPerPage));
            NumberOfPages = NumberOfPages == 0 ? 1 : NumberOfPages;
            FirstPage();
        }

        /// <summary>
        /// Обновляет отображаемую коллекцию.
        /// </summary>
        /// <param name="collection">Коллекция элементов для отображения.</param>
        private void UpdateCollection(IEnumerable<TViewModel> collection)
        {
            DisplayCollection.Clear();
            foreach (TViewModel tvm in collection)
            {
                DisplayCollection.Add(tvm);
            }
        }

        /// <summary>
        /// Обновляет состояние доступности кнопок навигации.
        /// </summary>
        private void UpdateButtonEnableStates()
        {
            NextPageCommand.NotifyCanExecuteChanged();
            PreviousPageCommand.NotifyCanExecuteChanged();
            FirstPageCommand.NotifyCanExecuteChanged();
            LastPageCommand.NotifyCanExecuteChanged();
        }

        /// <summary>
        /// Переход на следующую страницу.
        /// </summary>
        private void NextPage()
        {
            CurrentPage++;
            int offset = (CurrentPage - 1) * SelectedRecordsPerPage;
            UpdateCollection(_collectionView.Cast<TViewModel>().Skip(offset).Take(SelectedRecordsPerPage));
            UpdateButtonEnableStates();
        }

        /// <summary>
        /// Переход на предыдущую страницу.
        /// </summary>
        private void PreviousPage()
        {
            CurrentPage--;
            int offset = (CurrentPage - 1) * SelectedRecordsPerPage;
            UpdateCollection(_collectionView.Cast<TViewModel>().Skip(offset).Take(SelectedRecordsPerPage));
            UpdateButtonEnableStates();
        }

        /// <summary>
        /// Переход на первую страницу.
        /// </summary>
        private void FirstPage()
        {
            UpdateCollection(_collectionView.Cast<TViewModel>().Take(SelectedRecordsPerPage));
            CurrentPage = 1;
            UpdateButtonEnableStates();
        }

        /// <summary>
        /// Переход на последнюю страницу.
        /// </summary>
        private void LastPage()
        {
            int offset = (NumberOfPages - 1) * SelectedRecordsPerPage;
            UpdateCollection(_collectionView.Cast<TViewModel>().Skip(offset).Take(SelectedRecordsPerPage));
            CurrentPage = NumberOfPages;
            UpdateButtonEnableStates();
        }

        /// <summary>
        /// Обновляет всю коллекцию с учётом текущих настроек пагинации и фильтра.
        /// </summary>
        public void RefreshCollection()
        {
            UpdateRecordsPerPage();
            int offset = (CurrentPage - 1) * SelectedRecordsPerPage;
            UpdateCollection(_collectionView.Cast<TViewModel>().Skip(offset).Take(SelectedRecordsPerPage));
            UpdateButtonEnableStates();
        }

        /// <summary>
        /// Освобождает ресурсы, используемые объектом.
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
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}