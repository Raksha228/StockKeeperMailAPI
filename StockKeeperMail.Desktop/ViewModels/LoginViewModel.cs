using MaterialDesignThemes.Wpf;
using CommunityToolkit.Mvvm.Input;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// ViewModel для формы входа в систему.
    /// Управляет аутентификацией пользователя, переключением темы, отображением справки и выходом из приложения.
    /// </summary>
    class LoginViewModel : ViewModelBase
    {
        private bool _isDisposed = false;
        private readonly PaletteHelper paletteHelper = new PaletteHelper();

        public string text { get; set; }

        private bool _isDarkTheme;
        public bool IsDarkTheme
        {
            get => _isDarkTheme;
            set => SetProperty(ref _isDarkTheme, value);
        }

        private string _username;
        public string Username
        {
            get => _username;
            set => SetProperty(ref _username, value);
        }

        private readonly UnitOfWork _unitOfWork;
        private readonly NavigationStore _navigationStore;
        private readonly AuthenticationStore _authenticationStore;

        public RelayCommand ToggleThemeCommand { get; }
        public RelayCommand HelpCommand { get; }
        public RelayCommand ExitAppCommand { get; }
        public RelayCommand<object> LoginUserCommand { get; }

        /// <summary>
        /// Инициализирует новый экземпляр ViewModel входа.
        /// </summary>
        /// <param name="navigationStore">Хранилище навигации.</param>
        /// <param name="authenticationStore">Хранилище данных аутентификации.</param>
        public LoginViewModel(NavigationStore navigationStore, AuthenticationStore authenticationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();
            _authenticationStore = authenticationStore;

            ToggleThemeCommand = new RelayCommand(ToggleTheme);
            HelpCommand = new RelayCommand(Help);
            LoginUserCommand = new RelayCommand<object>(LoginUser);
            ExitAppCommand = new RelayCommand(ExitApp);

            IsDarkTheme = paletteHelper.GetTheme().GetBaseTheme() == BaseTheme.Dark;
        }

        /// <summary>
        /// Отображает окно справки с контактной информацией.
        /// </summary>
        public void Help()
        {
            MessageBox.Show(Application.Current.MainWindow,
                "Для восстановления доступа обратитесь к системному администратору Волго-Мед.\n" + "Email: gfgfghghgogo@gmail.com",
                "Помощь");
        }

        /// <summary>
        /// Переключает тему оформления (светлая/тёмная).
        /// </summary>
        public void ToggleTheme()
        {
            Theme theme = paletteHelper.GetTheme();
            bool shouldUseDarkTheme = theme.GetBaseTheme() != BaseTheme.Dark;

            IsDarkTheme = shouldUseDarkTheme;
            App.ApplyBrandTheme(shouldUseDarkTheme);
        }

        /// <summary>
        /// Завершает работу приложения.
        /// </summary>
        public void ExitApp()
        {
            Application.Current.Shutdown();
        }

        /// <summary>
        /// Выполняет аутентификацию пользователя по имени и паролю.
        /// При успешном входе сохраняет данные сотрудника в хранилище и переходит к панели управления.
        /// </summary>
        /// <param name="obj">Объект PasswordBox для получения пароля.</param>
        private void LoginUser(object obj)
        {
            PasswordBox? passwordBox = obj as PasswordBox;

            string username = _username;
            string password = passwordBox?.Password ?? string.Empty;

            Staff storedStaff = _unitOfWork.StaffRepository.Get(s => s.StaffUsername == username && s.StaffPassword == password, includeProperties: "Role").SingleOrDefault();

            if (storedStaff == null)
            {
                MessageBox.Show("Неверные учётные данные. Пожалуйста, попробуйте снова.");
                return;
            }

            _authenticationStore.CurrentStaff = storedStaff;
            _authenticationStore.IsLoggedIn = true;

            _navigationStore.CurrentViewModel = DashboardViewModel.LoadViewModel(_navigationStore);
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
                }
            }
            // вызов методов очистки неуправляемых ресурсов

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}