using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using StockKeeperMail.Desktop.ViewModels.ListViewHelpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для отображения списка бракованных товаров.
    /// Управляет загрузкой, созданием, редактированием и удалением записей о браке.
    /// </summary>
    public class DefectiveListViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private bool _isDialogOpen = false;
        public bool IsDialogOpen => _isDialogOpen;

        private ViewModelBase _dialogViewModel;
        public ViewModelBase DialogViewModel => _dialogViewModel;

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        public DefectiveListViewHelper DefectiveListViewHelper { get; }

        private readonly ObservableCollection<DefectiveViewModel> _defectives;
        public ObservableCollection<DefectiveViewModel> Defectives { get; }

        public RelayCommand CreateDefectiveCommand { get; }
        public RelayCommand LoadDefectivesCommand { get; }
        public RelayCommand<DefectiveViewModel> RemoveDefectiveCommand { get; }
        public RelayCommand<DefectiveViewModel> EditDefectiveCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel списка бракованных товаров.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        public DefectiveListViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            _defectives = new ObservableCollection<DefectiveViewModel>();
            Defectives = new ObservableCollection<DefectiveViewModel>();
            DefectiveListViewHelper = new DefectiveListViewHelper(_defectives, Defectives);

            LoadDefectivesCommand = new RelayCommand(LoadDefectives);
            RemoveDefectiveCommand = new RelayCommand<DefectiveViewModel>(RemoveDefective);
            EditDefectiveCommand = new RelayCommand<DefectiveViewModel>(EditDefective);
            CreateDefectiveCommand = new RelayCommand(CreateDefective);
        }

        /// <summary>
        /// Удаляет выбранную запись о бракованном товаре после подтверждения пользователя.
        /// </summary>
        /// <param name="defectiveViewModel">ViewModel удаляемой записи.</param>
        private void RemoveDefective(DefectiveViewModel defectiveViewModel)
        {
            var result = MessageBox.Show("Вы действительно хотите удалить этот элемент?", "Предупреждение", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                _unitOfWork.DefectiveRepository.Delete(defectiveViewModel.Defective);
                _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.DEFECTIVES, ActionType.DELETE, $"Defective deleted; DefectiveID:{defectiveViewModel.DefectiveID};"));
                _unitOfWork.Save();
                _defectives.Remove(defectiveViewModel);
                DefectiveListViewHelper.RefreshCollection();
                MessageBox.Show("Успешно");
            }
        }

        /// <summary>
        /// Открывает диалог редактирования выбранной записи о браке.
        /// </summary>
        /// <param name="defectiveViewModel">ViewModel записи для редактирования.</param>
        private void EditDefective(DefectiveViewModel defectiveViewModel)
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = EditDefectiveViewModel.LoadViewModel(_navigationStore, _unitOfWork, defectiveViewModel.Defective, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Открывает диалог создания новой записи о бракованном товаре.
        /// </summary>
        private void CreateDefective()
        {
            _dialogViewModel?.Dispose();
            _dialogViewModel = CreateDefectiveViewModel.LoadViewModel(_navigationStore, _unitOfWork, CloseDialogCallback);
            OnPropertyChanged(nameof(DialogViewModel));

            _isDialogOpen = true;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Callback-метод, вызываемый при закрытии диалогового окна.
        /// Обновляет список записей о браке и закрывает диалог.
        /// </summary>
        private void CloseDialogCallback()
        {
            LoadDefectives();

            _isDialogOpen = false;
            OnPropertyChanged(nameof(IsDialogOpen));
        }

        /// <summary>
        /// Загружает список всех бракованных товаров из базы данных.
        /// </summary>
        private void LoadDefectives()
        {
            _defectives.Clear();
            foreach (Defective u in _unitOfWork.DefectiveRepository.Get(includeProperties: "Product"))
            {
                _defectives.Add(new DefectiveViewModel(u));
            }
            DefectiveListViewHelper.RefreshCollection();
        }

        /// <summary>
        /// Фабричный метод для создания ViewModel с предварительной загрузкой данных.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <returns>Загруженный экземпляр DefectiveListViewModel.</returns>
        public static DefectiveListViewModel LoadViewModel(NavigationStore navigationStore)
        {
            DefectiveListViewModel viewModel = new DefectiveListViewModel(navigationStore);
            viewModel.LoadDefectivesCommand.Execute(null);

            return viewModel;
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
                    DefectiveListViewHelper?.Dispose();
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}