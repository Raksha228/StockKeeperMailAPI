using StockKeeperMail.Database.Models;
using System;

namespace StockKeeperMail.Desktop.DAL
{
    /// <summary>
    /// Представляет класс UnitOfWork.
    /// В API-версии является совместимым фасадом над REST-репозиториями.
    /// </summary>
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private bool disposed = false;

        public GenericRepository<Role> RoleRepository { get; }
        public GenericRepository<Category> CategoryRepository { get; }
        public GenericRepository<Warehouse> WarehouseRepository { get; }
        public GenericRepository<Supplier> SupplierRepository { get; }
        public GenericRepository<Staff> StaffRepository { get; }
        public GenericRepository<Product> ProductRepository { get; }
        public GenericRepository<Order> OrderRepository { get; }
        public GenericRepository<OrderDetail> OrderDetailRepository { get; }
        public GenericRepository<Location> LocationRepository { get; }
        public GenericRepository<Customer> CustomerRepository { get; }
        public GenericRepository<Defective> DefectiveRepository { get; }
        public GenericRepository<ProductLocation> ProductLocationRepository { get; }
        public GenericRepository<Log> LogRepository { get; }
        public GenericRepository<InternalMessage> InternalMessageRepository { get; }

        public UnitOfWork()
        {
            RoleRepository = new GenericRepository<Role>();
            CategoryRepository = new GenericRepository<Category>();
            WarehouseRepository = new GenericRepository<Warehouse>();
            SupplierRepository = new GenericRepository<Supplier>();
            StaffRepository = new GenericRepository<Staff>();
            ProductRepository = new GenericRepository<Product>();
            OrderRepository = new GenericRepository<Order>();
            OrderDetailRepository = new GenericRepository<OrderDetail>();
            LocationRepository = new GenericRepository<Location>();
            CustomerRepository = new GenericRepository<Customer>();
            DefectiveRepository = new GenericRepository<Defective>();
            ProductLocationRepository = new GenericRepository<ProductLocation>();
            LogRepository = new GenericRepository<Log>();
            InternalMessageRepository = new GenericRepository<InternalMessage>();
        }

        public void Begin()
        {
        }

        public void Rollback()
        {
        }

        public void Commit()
        {
        }

        public void Save()
        {
            // В API-версии операции выполняются немедленно для совместимости с существующим UI.
            // Метод сохранен как no-op, чтобы не ломать текущие ViewModel.
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
