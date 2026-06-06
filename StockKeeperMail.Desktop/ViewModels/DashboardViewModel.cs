using LiveCharts;
using LiveCharts.Wpf;
using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Stores;
using System;
using System.Collections.Generic;
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
        private readonly CultureInfo _ruCulture = new CultureInfo("ru-RU");

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
            private set { SetProperty(ref _monthlySales, value); }
        }

        private string[] _monthlySalesXLabel;
        public string[] MonthlySalesXLabel
        {
            get { return _monthlySalesXLabel; }
            private set { SetProperty(ref _monthlySalesXLabel, value); }
        }

        public Func<double, string> MonthlySalesFormatter { get; private set; }

        public IEnumerable<string> OrderChartPeriods { get; } = new[]
        {
            "За день",
            "За месяц",
            "За год",
            "Весь период"
        };

        private string _selectedOrderChartPeriod;
        public string SelectedOrderChartPeriod
        {
            get { return _selectedOrderChartPeriod; }
            set
            {
                if (SetProperty(ref _selectedOrderChartPeriod, value))
                {
                    BuildOrderStatisticsChart();
                }
            }
        }

        public DashboardViewModel(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _unitOfWork = new UnitOfWork();

            decimal currentMonthRevenueValue = _unitOfWork.OrderRepository
                .Get(filter: o => o.OrderDate.Month == DateTime.Now.Month && o.OrderDate.Year == DateTime.Now.Year)
                .Sum(o => o.OrderTotal);

            _currentMonthRevenue = currentMonthRevenueValue.ToString("N2", _ruCulture);

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

            MonthlySalesFormatter = value => value.ToString("N0", _ruCulture);
            _selectedOrderChartPeriod = OrderChartPeriods.First();
            BuildOrderStatisticsChart();
        }

        private void BuildOrderStatisticsChart()
        {
            List<Order> orders = _unitOfWork.OrderRepository.Get().ToList();
            DateTime now = DateTime.Now;

            List<string> labels;
            List<double> values;

            switch (_selectedOrderChartPeriod)
            {
                case "За день":
                    labels = Enumerable.Range(0, 24).Select(hour => hour.ToString("00") + ":00").ToList();
                    values = Enumerable.Range(0, 24)
                        .Select(hour => (double)orders.Count(o => o.OrderDate.Date == now.Date && o.OrderDate.Hour == hour))
                        .ToList();
                    break;

                case "За месяц":
                    int daysInMonth = DateTime.DaysInMonth(now.Year, now.Month);
                    labels = Enumerable.Range(1, daysInMonth).Select(day => day.ToString()).ToList();
                    values = Enumerable.Range(1, daysInMonth)
                        .Select(day => (double)orders.Count(o => o.OrderDate.Year == now.Year && o.OrderDate.Month == now.Month && o.OrderDate.Day == day))
                        .ToList();
                    break;

                case "За год":
                    labels = Enumerable.Range(1, 12)
                        .Select(month => FirstCharToUpper(_ruCulture.DateTimeFormat.GetAbbreviatedMonthName(month)))
                        .ToList();
                    values = Enumerable.Range(1, 12)
                        .Select(month => (double)orders.Count(o => o.OrderDate.Year == now.Year && o.OrderDate.Month == month))
                        .ToList();
                    break;

                default:
                    List<int> years = orders
                        .Select(o => o.OrderDate.Year)
                        .Distinct()
                        .OrderBy(year => year)
                        .ToList();

                    if (years.Count == 0)
                    {
                        years.Add(now.Year);
                    }

                    labels = years.Select(year => year.ToString()).ToList();
                    values = years.Select(year => (double)orders.Count(o => o.OrderDate.Year == year)).ToList();
                    break;
            }

            double totalOrders = values.Sum();

            MonthlySales = new SeriesCollection
            {
                new ColumnSeries
                {
                    Title = "Заказы",
                    Values = new ChartValues<double>(values),
                    Fill = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#0B3BDE")),
                    Stroke = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#0625AA")),
                    StrokeThickness = 1.5,
                    LabelPoint = point =>
                    {
                        double share = totalOrders <= 0 ? 0 : Math.Round(point.Y / totalOrders * 100, 2);
                        return $"{point.Y.ToString("N0", _ruCulture)} заказ(ов) • Доля: {share.ToString("N2", _ruCulture)}%";
                    }
                }
            };

            MonthlySalesXLabel = labels.ToArray();
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
