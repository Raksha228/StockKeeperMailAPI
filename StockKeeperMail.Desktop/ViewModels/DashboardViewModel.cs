using LiveCharts;
using LiveCharts.Wpf;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Globalization;
using System.Linq;
using System.Windows.Media;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс DashboardViewModel.
    /// </summary>
    class DashboardViewModel : ViewModelBase
    {
        private bool _isDisposed = false;
        private readonly NavigationStore _navigationStore;
        private readonly UnitOfWork _unitOfWork;

        private string _currentMonthRevenue;
        public string CurrentMonthRevenue
        {
            get { return _currentMonthRevenue; }
        }

        private string _currentMonthOrders;
        public string CurrentMonthOrders
        {
            get { return _currentMonthOrders; }
        }

        private string _productsInStock;
        public string ProductsInStock
        {
            get { return _productsInStock; }
        }

        private int _processingOrdersCount;
        public int ProcessingOrdersCount
        {
            get { return _processingOrdersCount; }
        }

        private int _shippedOrdersCount;
        public int ShippedOrdersCount
        {
            get { return _shippedOrdersCount; }
        }

        private int _inTransitOrdersCount;
        public int InTransitOrdersCount
        {
            get { return _inTransitOrdersCount; }
        }

        private int _deliveredOrdersCount;
        public int DeliveredOrdersCount
        {
            get { return _deliveredOrdersCount; }
        }

        private SeriesCollection _monthlySales;
        public SeriesCollection MonthlySales
        {
            get { return _monthlySales; }
        }

        public string[] MonthlySalesXLabel { get; private set; }

        public Func<double, string> MonthlySalesFormatter { get; private set; }

        public DashboardViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            decimal currentMonthRevenueValue = _unitOfWork.OrderRepository
                .Get(filter: o => o.OrderDate.Month == DateTime.Now.Month && o.OrderDate.Year == DateTime.Now.Year)
                .Sum(o => o.OrderTotal);

            _currentMonthRevenue = currentMonthRevenueValue.ToString("N2", new CultureInfo("ru-RU"));

            _currentMonthOrders = _unitOfWork.OrderRepository
                .Get(filter: o => o.OrderDate.Month == DateTime.Now.Month && o.OrderDate.Year == DateTime.Now.Year)
                .Count()
                .ToString();

            _productsInStock = _unitOfWork.ProductLocationRepository
                .Get()
                .Sum(pl => pl.ProductQuantity)
                .ToString();

            _processingOrdersCount = _unitOfWork.OrderRepository.Get(filter: o => o.DeliveryStatus == "Processing").Count();
            _shippedOrdersCount = _unitOfWork.OrderRepository.Get(filter: o => o.DeliveryStatus == "Shipped").Count();
            _inTransitOrdersCount = _unitOfWork.OrderRepository.Get(filter: o => o.DeliveryStatus == "In Transit").Count();
            _deliveredOrdersCount = _unitOfWork.OrderRepository.Get(filter: o => o.DeliveryStatus == "Delivered").Count();

            var monthlySalesData = _unitOfWork.OrderRepository
                .Get(o => o.OrderDate.Year == DateTime.Now.Year)
                .GroupBy(o => o.OrderDate.Month)
                .OrderBy(g => g.Key)
                .Select(g => new
                {
                    Month = CultureInfo.GetCultureInfo("ru-RU").DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                    Sales = (double)g.Sum(x => x.OrderTotal)
                })
                .ToList();

            double totalYearSales = monthlySalesData.Sum(d => d.Sales);
            CultureInfo ruCulture = new CultureInfo("ru-RU");

            _monthlySales = new SeriesCollection
            {
                new ColumnSeries
                {
                    Title = "Продажи",
                    Values = new ChartValues<double>(monthlySalesData.Select(d => d.Sales)),
                    Fill = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#0B3BDE")),
                    Stroke = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#0625AA")),
                    StrokeThickness = 1.5,
                    LabelPoint = point =>
                    {
                        double share = totalYearSales <= 0 ? 0 : Math.Round(point.Y / totalYearSales * 100, 2);
                        return $"{point.Y.ToString("N0", ruCulture)} руб. • Доля месяца: {share.ToString("N2", ruCulture)}%";
                    }
                }
            };

            MonthlySalesXLabel = monthlySalesData
                .Select(d => FirstCharToUpper(d.Month))
                .ToArray();

            MonthlySalesFormatter = value => value.ToString("N0", new CultureInfo("ru-RU"));
        }

        private string FirstCharToUpper(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return value;
            }

            if (value.Length == 1)
            {
                return value.ToUpper();
            }

            return char.ToUpper(value[0]) + value.Substring(1);
        }

        public static DashboardViewModel LoadViewModel(NavigationStore navigationStore)
        {
            DashboardViewModel dashBoardViewModel = new DashboardViewModel(navigationStore);
            return dashBoardViewModel;
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    _unitOfWork.Dispose();
                }
            }

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}