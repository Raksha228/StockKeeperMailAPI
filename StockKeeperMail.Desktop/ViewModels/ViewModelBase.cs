using CommunityToolkit.Mvvm.ComponentModel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Базовый класс для всех ViewModel в приложении.
    /// Реализует <see cref="IDisposable"/> для корректного освобождения ресурсов.
    /// Наследуется от <see cref="ObservableValidator"/> для поддержки валидации свойств.
    /// </summary>
    public class ViewModelBase : ObservableValidator, IDisposable
    {
        private bool disposed = false;

        /// <summary>
        /// Реализация метода <see cref="IDisposable.Dispose"/>.
        /// Вызывает защищённый виртуальный метод <see cref="Dispose(bool)"/>.
        /// </summary>
        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Защищённый виртуальный метод для освобождения ресурсов.
        /// </summary>
        /// <param name="disposing">
        /// Если <c>true</c>, освобождаются как управляемые, так и неуправляемые ресурсы.
        /// Если <c>false</c>, освобождаются только неуправляемые ресурсы.
        /// </param>
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing) // освобождаем все неуправляемые и управляемые ресурсы
                {
                    // освобождение ресурсов
                }
            }

            // вызов методов очистки неуправляемых ресурсов

            disposed = true;
        }
    }
}