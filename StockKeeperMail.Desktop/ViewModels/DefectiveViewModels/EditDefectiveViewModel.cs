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
    /// ViewModel для формы редактирования записи о бракованном товаре.
    /// Позволяет изменить количество бракованного товара и корректирует остатки на складе.
    /// </summary>
    public class EditDefectiveViewModel : ViewModelBase
    {
        private bool _isDisposed = false;

        private Defective _defective;

        private ProductViewModel _product;

        public ProductViewModel Product => _product;

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

        public RelayCommand SubmitCommand { get; }
        public RelayCommand CancelCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel редактирования бракованного товара.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="unitOfWork">Unit of Work для работы с базой данных.</param>
        /// <param name="defective">Редактируемая запись о браке.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        public EditDefectiveViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Defective defective, Action closeDialogCallback)
        {
            _defective = defective;
            _unitOfWork = unitOfWork;
            _navigationStore = navigationStore;
            _closeDialogCallback = closeDialogCallback;

            SetInitialValues(_defective);

            SubmitCommand = new RelayCommand(Submit);
            CancelCommand = new RelayCommand(Cancel);
        }

        /// <summary>
        /// Устанавливает начальные значения полей из редактируемой записи.
        /// </summary>
        /// <param name="defective">Запись о браке, чьи значения используются.</param>
        private void SetInitialValues(Defective defective)
        {
            _product = new ProductViewModel(defective.Product);
            _quantity = defective.Quantity.ToString();
        }

        /// <summary>
        /// Сохраняет изменения количества бракованного товара.
        /// Проверяет, не превышает ли новое количество доступный остаток на складе.
        /// Если валидация не пройдена или количество превышает запас, сохранение не выполняется.
        /// </summary>
        private void Submit()
        {
            ValidateAllProperties();
            int previousQuantity = _defective.Quantity;

            if (HasErrors)
            {
                return;
            }
            else if (Convert.ToInt32(_quantity) - previousQuantity > _product.Product.ProductQuantity)
            {
                string quantity = _product.ProductQuantity;
                MessageBox.Show($"Количество превышает доступный запас! Доступно: {quantity}");
                return;
            }
            _defective.Quantity = Convert.ToInt32(_quantity);
            _defective.Product.ProductQuantity -= (_defective.Quantity - previousQuantity);

            _unitOfWork.DefectiveRepository.Update(_defective);
            _unitOfWork.ProductRepository.Update(_defective.Product);
            _unitOfWork.Save();

            _closeDialogCallback();
        }

        /// <summary>
        /// Отменяет редактирование и закрывает диалог без сохранения изменений.
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
        /// <param name="defective">Редактируемая запись о браке.</param>
        /// <param name="closeDialogCallback">Метод обратного вызова для закрытия диалога.</param>
        /// <returns>Экземпляр EditDefectiveViewModel.</returns>
        public static EditDefectiveViewModel LoadViewModel(NavigationStore navigationStore, UnitOfWork unitOfWork, Defective defective, Action closeDialogCallback)
        {
            EditDefectiveViewModel viewModel = new EditDefectiveViewModel(navigationStore, unitOfWork, defective, closeDialogCallback);
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