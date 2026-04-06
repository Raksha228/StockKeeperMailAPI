using System;
using System.Collections.Generic;
using System.Globalization;
using System.Windows.Data;

namespace StockKeeperMail.Desktop.Converters
{
    /// <summary>
    /// Представляет класс EnglishToRussianUiTextConverter.
    /// </summary>
    public class EnglishToRussianUiTextConverter : IValueConverter
    {
        private static readonly Dictionary<string, string> Translations =
            new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Active", "Активный" },
                { "Inactive", "Неактивный" },

                { "Available", "Доступен" },
                { "Unavailable", "Недоступен" },
                { "Out Of Stock", "Нет в наличии" },

                { "Processing", "В обработке" },
                { "Shipped", "Отправлен" },
                { "In Transit", "В пути" },
                { "Delivered", "Доставлен" }
            };

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value == null)
                return string.Empty;

            string source = value.ToString();

            if (string.IsNullOrWhiteSpace(source))
                return string.Empty;

            if (Translations.TryGetValue(source, out string translated))
                return translated;

            return source;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return Binding.DoNothing;
        }
    }
}