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
    /// ViewModel для формы объявления товара на складе бракованным.
    /// Позволяет указать количество бракованного товара, списывает его со склада и создаёт запись в журнале брака.
    /// </summary>
    public class DeclareDefectiveProductViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private ProductLocation _productLocation;

        public ProductViewModel Product => new ProductViewModel(_productLocation.Product);

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

        private readonly ObservableCollection<ProductViewModel> _products;
        public IEnumerable<ProductViewModel> Products => _products;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        private RelayCommand LoadProductsCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel объявления брака.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="productLocation">Местоположение товара на складе.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public DeclareDefectiveProductViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;
            _productLocation = productLocation;
            _products = new ObservableCollection<ProductViewModel>();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
            LoadProductsCommand = new RelayCommand(LoadProducts);
        }

        /// <summary>
        /// Отправляет данные формы: создаёт запись о браке, уменьшает количество товара в локации и общее количество товара.
        /// Если валидация не пройдена или количество превышает доступное, сохранение не выполняется.
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

            Defective newDefective = new Defective()
            {
                DefectiveID = Guid.NewGuid(),
                ProductID = _productLocation.ProductID,
                Quantity = Convert.ToInt32(_quantity),
                DateDeclared = DateTime.Now
            };

            _unitOfWork.DefectiveRepository.Insert(newDefective);
            _productLocation.ProductQuantity -= Convert.ToInt32(_quantity);
            _productLocation.Product.ProductQuantity -= Convert.ToInt32(_quantity);

            _unitOfWork.ProductLocationRepository.Update(_productLocation);
            _unitOfWork.ProductRepository.Update(_productLocation.Product);
            _unitOfWork.LogRepository.Insert(LogUtil.CreateLog(LogCategory.STORAGES, ActionType.DELARE_AS_DEFECTIVE, $"Product declared as defective; ProductID: {_productLocation.ProductID}, Quantity: {_quantity}"));
            _unitOfWork.Save();

            MessageBox.Show("Успешно");
            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет операцию и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Загружает список всех товаров из базы данных.
        /// </summary>
        private void LoadProducts()
        {
            _products.Clear();
            foreach (Product r in _unitOfWork.ProductRepository.Get())
            {
                _products.Add(new ProductViewModel(r));
            }
        }

        /// <summary>
        /// Фабричный метод для загрузки ViewModel с необходимыми зависимостями.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="productLocation">Местоположение товара на складе.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр DeclareDefectiveProductViewModel.</returns>
        public static DeclareDefectiveProductViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, ProductLocation productLocation, Action closeDialogCallback)
        {
            DeclareDefectiveProductViewModel viewModel = new DeclareDefectiveProductViewModel(navigationStore, unitOfWork, productLocation, closeDialogCallback);
            viewModel.LoadProductsCommand.Execute(null);
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