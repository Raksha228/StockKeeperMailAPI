using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы создания записи о бракованном товаре.
    /// Обеспечивает валидацию вводимых данных, проверку наличия товара на складе и сохранение в базе данных.
    /// </summary>
    public class CreateDefectiveViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private string _productID;

        [Required(ErrorMessage = "Товар обязателен для заполнения")]
        public string ProductID
        {
            get => _productID;
            set
            {
                SetProperty(ref _productID, value, true);
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

        private readonly ObservableCollection<ProductViewModel> _products;
        public IEnumerable<ProductViewModel> Products => _products;

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }
        private RelayCommand LoadProductsCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel создания бракованного товара.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public CreateDefectiveViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            _navigationStore = navigationStore;
            _unitOfWork = unitOfWork;
            _closeDialogCallback = closeDialogCallback;
            _products = new ObservableCollection<ProductViewModel>();

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
            LoadProductsCommand = new RelayCommand(LoadProducts);
        }

        /// <summary>
        /// Отправляет данные формы, создаёт запись о бракованном товаре и уменьшает количество товара на складе.
        /// Если валидация не пройдена или количество превышает доступный запас, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();

            if (HasErrors)
            {
                return;
            }
            else if (_productID != null && Convert.ToInt32(_quantity) > _products.SingleOrDefault(p => p.ProductID == _productID).Product.ProductQuantity)
            {
                string quantity = _products.SingleOrDefault(p => p.ProductID == _productID).ProductQuantity;
                MessageBox.Show($"Количество превышает доступный запас! Доступно: {quantity}");
                return;
            }

            Defective newDefective = new Defective()
            {
                DefectiveID = Guid.NewGuid(),
                ProductID = new Guid(_productID),
                Product = Products.SingleOrDefault(p => p.ProductID == _productID).Product,
                Quantity = Convert.ToInt32(_quantity),
                DateDeclared = DateTime.Now
            };

            _unitOfWork.DefectiveRepository.Insert(newDefective);
            newDefective.Product.ProductQuantity -= Convert.ToInt32(_quantity);
            _unitOfWork.ProductRepository.Update(newDefective.Product);
            _unitOfWork.Save();

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет создание записи и закрывает диалог.
        /// </summary>
        private void Cancel()
        {
            _closeDialogCallback();
        }

        /// <summary>
        /// Загружает список доступных товаров из базы данных.
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
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр CreateDefectiveViewModel.</returns>
        public static CreateDefectiveViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Action closeDialogCallback)
        {
            CreateDefectiveViewModel viewModel = new CreateDefectiveViewModel(navigationStore, unitOfWork, closeDialogCallback);
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