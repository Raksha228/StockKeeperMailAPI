using MaterialDesignThemes.Wpf;
using StockKeeperMail.Desktop.Api;
using StockKeeperMail.Desktop.Stores;
using StockKeeperMail.Desktop.ViewModels;
using System;
using System.Windows;
using System.Windows.Media;

namespace StockKeeperMail.Desktop
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private readonly NavigationStore _navigationStore;
        private readonly AuthenticationStore _authenticationStore;

        public App()
        {
            SplashScreen splashScreen = new SplashScreen("Assets/SplashScreen.png");
            splashScreen.Show(true);

            _navigationStore = new NavigationStore();
            _authenticationStore = new AuthenticationStore();
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            ApplyBrandTheme();

            if (!ApiClientFactory.IsApiAvailable())
            {
                MessageBox.Show(
                    "Не удалось подключиться к REST API. Запусти проект StockKeeperMail.Api и проверь BaseUrl в файле apiconfig.json",
                    "API недоступен",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);

                Shutdown();
                return;
            }

            MainWindow = new MainWindow()
            {
                DataContext = new MainViewModel(_navigationStore, _authenticationStore)
            };

            MainWindow.Show();

            base.OnStartup(e);
        }

        private static void ApplyBrandTheme()
        {
            var paletteHelper = new PaletteHelper();
            var theme = paletteHelper.GetTheme();

            theme.SetPrimaryColor((Color)ColorConverter.ConvertFromString("#0B3BDE"));
            theme.SetSecondaryColor((Color)ColorConverter.ConvertFromString("#AA1845"));

            paletteHelper.SetTheme(theme);
        }
    }
}
