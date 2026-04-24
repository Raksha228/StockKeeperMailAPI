using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using StockKeeperMail.Desktop.Services;
using System.Linq.Expressions;

namespace StockKeeperMail.Desktop.Tests;

public class AuthenticationServiceTests
{
    [Fact]
    public void Login_WithValidCredentials_ReturnsStaffAndStoresCurrentStaff()
    {
        Staff expectedStaff = new Staff
        {
            StaffID = Guid.NewGuid(),
            StaffUsername = "admin",
            StaffPassword = "admin123",
            StaffFirstName = "Иван",
            StaffLastName = "Петров"
        };

        FakeUnitOfWork unitOfWork = new FakeUnitOfWork([expectedStaff]);
        AuthenticationService authenticationService = new AuthenticationService(unitOfWork);

        Staff? result = authenticationService.Login("admin", "admin123");

        Assert.NotNull(result);
        Assert.Equal(expectedStaff.StaffID, result!.StaffID);
        Assert.Equal(expectedStaff.StaffID, authenticationService.Staff?.StaffID);
    }

    [Fact]
    public void Login_WithInvalidCredentials_ReturnsNull()
    {
        FakeUnitOfWork unitOfWork = new FakeUnitOfWork(
        [
            new Staff
            {
                StaffID = Guid.NewGuid(),
                StaffUsername = "admin",
                StaffPassword = "admin123"
            }
        ]);

        AuthenticationService authenticationService = new AuthenticationService(unitOfWork);

        Staff? result = authenticationService.Login("admin", "wrong-password");

        Assert.Null(result);
        Assert.Null(authenticationService.Staff);
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public FakeUnitOfWork(IEnumerable<Staff>? staff = null)
        {
            RoleRepository = new FakeGenericRepository<Role>();
            CategoryRepository = new FakeGenericRepository<Category>();
            WarehouseRepository = new FakeGenericRepository<Warehouse>();
            SupplierRepository = new FakeGenericRepository<Supplier>();
            StaffRepository = new FakeGenericRepository<Staff>(staff ?? Enumerable.Empty<Staff>());
            ProductRepository = new FakeGenericRepository<Product>();
            OrderRepository = new FakeGenericRepository<Order>();
            OrderDetailRepository = new FakeGenericRepository<OrderDetail>();
            LocationRepository = new FakeGenericRepository<Location>();
            CustomerRepository = new FakeGenericRepository<Customer>();
        }

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

        public void Save()
        {
        }
    }

    private sealed class FakeGenericRepository<TEntity> : GenericRepository<TEntity> where TEntity : class
    {
        private readonly List<TEntity> _items;

        public FakeGenericRepository(IEnumerable<TEntity>? items = null)
        {
            _items = items?.ToList() ?? new List<TEntity>();
        }

        public override IEnumerable<TEntity> Get(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = _items.AsQueryable();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }

            return query.ToList();
        }
    }
}
