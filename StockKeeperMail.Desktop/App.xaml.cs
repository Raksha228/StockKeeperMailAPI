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
            ApplyBrandTheme(false);

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

        public static void ApplyBrandTheme(bool isDarkTheme)
        {
            var paletteHelper = new PaletteHelper();
            var theme = paletteHelper.GetTheme();

            theme.SetBaseTheme(isDarkTheme ? BaseTheme.Dark : BaseTheme.Light);
            theme.SetPrimaryColor((Color)ColorConverter.ConvertFromString("#0B3BDE"));
            theme.SetSecondaryColor((Color)ColorConverter.ConvertFromString("#1D9BFF"));

            paletteHelper.SetTheme(theme);
            ApplyCustomBrushes(isDarkTheme);
        }

        private static void ApplyCustomBrushes(bool isDarkTheme)
        {
            if (Current?.Resources == null)
            {
                return;
            }

            var resources = Current.Resources;

            void SetBrush(string key, string color) => resources[key] = new SolidColorBrush((Color)ColorConverter.ConvertFromString(color));
            void SetLinearGradient(string key, params string[] colors)
            {
                var brush = new LinearGradientBrush { StartPoint = new Point(0, 0), EndPoint = new Point(1, 1) };
                for (int i = 0; i < colors.Length; i++)
                {
                    double offset = colors.Length == 1 ? 1 : (double)i / (colors.Length - 1);
                    brush.GradientStops.Add(new GradientStop((Color)ColorConverter.ConvertFromString(colors[i]), offset));
                }

                resources[key] = brush;
            }

            if (isDarkTheme)
            {
                SetBrush("BrandPrimaryBrush", "#4E7DFF");
                SetBrush("BrandPrimaryDarkBrush", "#DCE8FF");
                SetBrush("BrandAccentBrush", "#1D9BFF");
                SetBrush("BrandAccentLightBrush", "#8DDDFF");
                SetBrush("BrandAccentWarmBrush", "#FF566B");
                SetBrush("BrandSuccessBrush", "#2DD4BF");
                SetBrush("BrandDangerBrush", "#FF6B81");
                SetBrush("BrandTextBrush", "#EAF3FF");
                SetBrush("BrandMutedTextBrush", "#A8BEDB");
                SetBrush("BrandSurfaceBrush", "#091528");
                SetBrush("BrandCardBrush", "#0D1C34");
                SetBrush("BrandBorderBrush", "#274A79");
                SetBrush("BrandNavTextBrush", "#F5FAFF");
                SetBrush("BrandNavMutedBrush", "#A8D8FF");
                SetBrush("BrandSubtleSurfaceBrush", "#132748");
                SetBrush("BrandWindowShellBrush", "#DB091528");
                SetBrush("BrandWindowInnerSurfaceBrush", "#0A1730");
                SetBrush("BrandFooterBrush", "#3308172E");
                SetBrush("InvoiceBackgroundBrush", "#10213E");
                SetBrush("InvoiceForegroundBrush", "#EAF3FF");
                SetBrush("InvoiceBorderBrush", "#6B91C8");
                SetBrush("InvoiceHeaderBackgroundBrush", "#162B4D");
                SetLinearGradient("AppBackgroundBrush", "#050D1A", "#08182E", "#0C2745");
                SetLinearGradient("BrandSidebarGradientBrush", "#061122", "#003090", "#0A5DB8");
                SetLinearGradient("BrandHeroGradientBrush", "#0039B7", "#1488E3");
                SetLinearGradient("BrandWarmGradientBrush", "#D93B56", "#FF6B6B");
            }
            else
            {
                SetBrush("BrandPrimaryBrush", "#0B3BDE");
                SetBrush("BrandPrimaryDarkBrush", "#002F8F");
                SetBrush("BrandAccentBrush", "#1D9BFF");
                SetBrush("BrandAccentLightBrush", "#8AD7FF");
                SetBrush("BrandAccentWarmBrush", "#FF4D66");
                SetBrush("BrandSuccessBrush", "#12B981");
                SetBrush("BrandDangerBrush", "#EF4D67");
                SetBrush("BrandTextBrush", "#172033");
                SetBrush("BrandMutedTextBrush", "#5F708C");
                SetBrush("BrandSurfaceBrush", "#F7FAFF");
                SetBrush("BrandCardBrush", "#FFFFFF");
                SetBrush("BrandBorderBrush", "#D7E4F4");
                SetBrush("BrandNavTextBrush", "#EFF8FF");
                SetBrush("BrandNavMutedBrush", "#B8E4FF");
                SetBrush("BrandSubtleSurfaceBrush", "#EEF4FF");
                SetBrush("BrandWindowShellBrush", "#F6FBFFFF");
                SetBrush("BrandWindowInnerSurfaceBrush", "#FFFFFF");
                SetBrush("BrandFooterBrush", "#90FFFFFF");
                SetBrush("InvoiceBackgroundBrush", "#FFFFFF");
                SetBrush("InvoiceForegroundBrush", "#172033");
                SetBrush("InvoiceBorderBrush", "#20437C");
                SetBrush("InvoiceHeaderBackgroundBrush", "#F1F5FB");
                SetLinearGradient("AppBackgroundBrush", "#F4F8FF", "#F3FAFF", "#F8FBFF");
                SetLinearGradient("BrandSidebarGradientBrush", "#081B49", "#0039B7", "#1283DB");
                SetLinearGradient("BrandHeroGradientBrush", "#0B3BDE", "#1696F3");
                SetLinearGradient("BrandWarmGradientBrush", "#FF4D66", "#FF7B7B");
            }
        }
    }
}
