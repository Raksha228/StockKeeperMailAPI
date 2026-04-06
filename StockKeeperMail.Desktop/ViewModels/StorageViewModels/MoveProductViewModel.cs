using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.Utilities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using static StockKeeperMail.Desktop.Utilities.Constants;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы перемещения товара между складами (локациями).
    /// Позволяет выбрать новую локацию, указать количество и переместить товар.
    /// </summary>
    class MoveProductViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private ProductLocation _productLocation;

        public ProductViewModel Product => new ProductViewModel(_productLocation.Product);

        private string _oldLocationID;

        private string _locationID;

        [Required(ErrorMessage = "Локация обязательна для заполнения")]
        public string LocationID
        {
            get { return _locationID; }
            set
            {
                SetProperty(ref _locationID, value, true);
            }
        }

        private string _quantity;

        [Required(ErrorMessage = "Количество обязательно для заполнения")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Количество должно содержать только цифры")]
        public string Quantity
        {
            get => _quantity;
            set
            {
                SetProperty(ref _quantity, value, true);
            }
        }

        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;
        private readonly Action _closeDialogCallback;

        private readonly ObservableCollection<LocationViewModel> _locations;
        public IEnumerable<LocationViewModel> Locations => _locations;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        private RelayCommand LoadLocationsCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel перемещения товара.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="productLocation">Текущее местоположение товара.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public MoveProductViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;
            _productLocation = productLocation;
            _locations = new ObservableCollection<LocationViewModel>();

            _oldLocationID = _productLocation.LocationID.ToString();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
            LoadLocationsCommand = new RelayCommand(LoadLocations);
        }

        /// <summary>
        /// Устанавливает начальные значения (не используется в текущей реализации).
        /// </summary>
        /// <param name="productLocation">Текущее местоположение товара.</param>
        private void SetInitialValues(ProductLocation productLocation)
        {
            _locationID = _productLocation.LocationID.ToString();
            _quantity = "0";
        }

        /// <summary>
        /// Выполняет перемещение товара: уменьшает количество в исходной локации,
        /// увеличивает (или создаёт запись) в целевой локации.
        /// Если валидация не пройдена или количество превышает доступное, перемещение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            int tmpQuantity;

            if (HasErrors)
            {
                return;
            }
            else if (Convert.ToInt32(_quantity) < 1)
            {
                MessageBox.Show("Разрешено только количество больше 0");
                return;
            }
            else if (!int.TryParse(_quantity, out tmpQuantity))
            {
                MessageBox.Show("Неверный ввод");
                return;
            }
            else if (tmpQuantity > _productLocation.ProductQuantity)
            {
                MessageBox.Show($"Количество превышает доступный запас! Доступно: {_productLocation.ProductQuantity}");
                return;
            }

            ProductLocation storedProductLocation = _unitOfWork.ProductLocationRepository.Get(pl => pl.ProductID == _productLocation.ProductID && pl.LocationID == new Guid(_locationID)).SingleOrDefault();
            if (storedProductLocation == null) // если товара в целевой локации нет — создаём новую запись
            {
                ProductLocation newProductLocation = new ProductLocation()
                {
                    ProductID = _productLocation.ProductID,
                    LocationID = new Guid(_locationID),
                    ProductQuantity = Convert.ToInt32(_quantity)
                };
                _unitOfWork.ProductLocationRepository.Insert(newProductLocation);
            }
            else // если товар уже есть в целевой локации — увеличиваем количество
            {
                storedProductLocation.ProductQuantity += Convert.ToInt32(_quantity);
                _unitOfWork.ProductLocationRepository.Update(storedProductLocation);
            }

            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.STORAGES, ActionType.MOVE, $"Product moved; ProductID: {_productLocation.ProductID}, From LocationID {_oldLocationID} to {_locationID}; Quantity: {_quantity};"));
            _productLocation.ProductQuantity -= Convert.ToInt32(_quantity);
            _unitOfWork.ProductLocationRepository.Update(_productLocation);
            _unitOfWork.Save();

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет перемещение и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Загружает список доступных локаций (исключая текущую).
        /// </summary>
        private void LoadLocations()
        {
            _locations.Clear();
            foreach (Location l in _unitOfWork.LocationRepository.Get(l => l.LocationID != _productLocation.LocationID))
            {
                _locations.Add(new LocationViewModel(l));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="productLocation">Текущее местоположение товара.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр MoveProductViewModel.</returns>
        public static MoveProductViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            MoveProductViewModel viewModel = new MoveProductViewModel(navigationStore, unitOfWork, productLocation, closeDialogCallback);
            viewModel.LoadLocationsCommand.Execute(null);
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