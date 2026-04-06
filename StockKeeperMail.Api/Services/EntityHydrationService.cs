using StockKeeperMail.Api.Data;
using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Services
{
    /// <summary>
    /// Наполняет сущности связанными данными для выдачи в WPF-клиент.
    /// Навигационные свойства в MongoDB не хранятся, они строятся на лету.
    /// </summary>
    public class EntityHydrationService
    {
        private readonly MongoRepository<Role> _roles;
        private readonly MongoRepository<Category> _categories;
        private readonly MongoRepository<Warehouse> _warehouses;
        private readonly MongoRepository<Supplier> _suppliers;
        private readonly MongoRepository<Staff> _staff;
        private readonly MongoRepository<Product> _products;
        private readonly MongoRepository<Order> _orders;
        private readonly MongoRepository<OrderDetail> _orderDetails;
        private readonly MongoRepository<Location> _locations;
        private readonly MongoRepository<Customer> _customers;
        private readonly MongoRepository<Defective> _defectives;
        private readonly MongoRepository<ProductLocation> _productLocations;
        private readonly MongoRepository<Log> _logs;
        private readonly MongoRepository<InternalMessage> _messages;

        public EntityHydrationService(
            MongoRepository<Role> roles,
            MongoRepository<Category> categories,
            MongoRepository<Warehouse> warehouses,
            MongoRepository<Supplier> suppliers,
            MongoRepository<Staff> staff,
            MongoRepository<Product> products,
            MongoRepository<Order> orders,
            MongoRepository<OrderDetail> orderDetails,
            MongoRepository<Location> locations,
            MongoRepository<Customer> customers,
            MongoRepository<Defective> defectives,
            MongoRepository<ProductLocation> productLocations,
            MongoRepository<Log> logs,
            MongoRepository<InternalMessage> messages)
        {
            _roles = roles;
            _categories = categories;
            _warehouses = warehouses;
            _suppliers = suppliers;
            _staff = staff;
            _products = products;
            _orders = orders;
            _orderDetails = orderDetails;
            _locations = locations;
            _customers = customers;
            _defectives = defectives;
            _productLocations = productLocations;
            _logs = logs;
            _messages = messages;
        }

        public async Task<List<TEntity>> HydrateAsync<TEntity>(List<TEntity> entities) where TEntity : class
        {
            if (typeof(TEntity) == typeof(Role))
                return (await HydrateRolesAsync(entities.Cast<Role>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Category))
                return (await HydrateCategoriesAsync(entities.Cast<Category>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Warehouse))
                return (await HydrateWarehousesAsync(entities.Cast<Warehouse>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Supplier))
                return (await HydrateSuppliersAsync(entities.Cast<Supplier>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Staff))
                return (await HydrateStaffAsync(entities.Cast<Staff>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Product))
                return (await HydrateProductsAsync(entities.Cast<Product>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Order))
                return (await HydrateOrdersAsync(entities.Cast<Order>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(OrderDetail))
                return (await HydrateOrderDetailsAsync(entities.Cast<OrderDetail>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Location))
                return (await HydrateLocationsAsync(entities.Cast<Location>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Customer))
                return (await HydrateCustomersAsync(entities.Cast<Customer>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Defective))
                return (await HydrateDefectivesAsync(entities.Cast<Defective>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(ProductLocation))
                return (await HydrateProductLocationsAsync(entities.Cast<ProductLocation>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(Log))
                return (await HydrateLogsAsync(entities.Cast<Log>().ToList())).Cast<TEntity>().ToList();
            if (typeof(TEntity) == typeof(InternalMessage))
                return (await HydrateMessagesAsync(entities.Cast<InternalMessage>().ToList())).Cast<TEntity>().ToList();

            return entities;
        }

        private Task<List<Role>> HydrateRolesAsync(List<Role> roles)
        {
            return Task.FromResult(roles);
        }

        private Task<List<Category>> HydrateCategoriesAsync(List<Category> categories)
        {
            return Task.FromResult(categories);
        }

        private Task<List<Warehouse>> HydrateWarehousesAsync(List<Warehouse> warehouses)
        {
            return Task.FromResult(warehouses);
        }

        private Task<List<Supplier>> HydrateSuppliersAsync(List<Supplier> suppliers)
        {
            return Task.FromResult(suppliers);
        }

        private async Task<List<Staff>> HydrateStaffAsync(List<Staff> staff)
        {
            Dictionary<Guid, Role> roleMap = (await _roles.GetAllAsync()).ToDictionary(r => r.RoleID);

            foreach (Staff item in staff)
            {
                roleMap.TryGetValue(item.RoleID, out Role role);
                item.Role = role;
            }

            return staff;
        }

        private async Task<List<Product>> HydrateProductsAsync(List<Product> products)
        {
            Dictionary<Guid, Supplier> supplierMap = (await _suppliers.GetAllAsync()).ToDictionary(s => s.SupplierID);
            Dictionary<Guid, Category> categoryMap = (await _categories.GetAllAsync()).ToDictionary(c => c.CategoryID);

            foreach (Product item in products)
            {
                supplierMap.TryGetValue(item.SupplierID, out Supplier supplier);
                categoryMap.TryGetValue(item.CategoryID, out Category category);
                item.Supplier = supplier;
                item.Category = category;
            }

            return products;
        }

        private async Task<List<Customer>> HydrateCustomersAsync(List<Customer> customers)
        {
            Dictionary<Guid, Staff> staffMap = (await HydrateStaffAsync(await _staff.GetAllAsync())).ToDictionary(s => s.StaffID);

            foreach (Customer item in customers)
            {
                staffMap.TryGetValue(item.StaffID, out Staff staff);
                item.Staff = staff;
            }

            return customers;
        }

        private async Task<List<OrderDetail>> HydrateOrderDetailsAsync(List<OrderDetail> orderDetails)
        {
            Dictionary<Guid, Product> productMap = (await HydrateProductsAsync(await _products.GetAllAsync())).ToDictionary(p => p.ProductID);
            Dictionary<Guid, Order> orderMap = (await _orders.GetAllAsync()).ToDictionary(o => o.OrderID);

            foreach (OrderDetail item in orderDetails)
            {
                productMap.TryGetValue(item.ProductID, out Product product);
                orderMap.TryGetValue(item.OrderID, out Order order);
                item.Product = product;
                item.Order = order;
            }

            return orderDetails;
        }

        private async Task<List<Order>> HydrateOrdersAsync(List<Order> orders)
        {
            Dictionary<Guid, Customer> customerMap = (await HydrateCustomersAsync(await _customers.GetAllAsync())).ToDictionary(c => c.CustomerID);
            List<OrderDetail> hydratedOrderDetails = await HydrateOrderDetailsAsync(await _orderDetails.GetAllAsync());

            foreach (Order item in orders)
            {
                customerMap.TryGetValue(item.CustomerID, out Customer customer);
                item.Customer = customer;
                item.OrderDetails = hydratedOrderDetails
                    .Where(od => od.OrderID == item.OrderID)
                    .OrderBy(od => od.Product?.ProductName)
                    .ToList();
            }

            return orders;
        }

        private async Task<List<ProductLocation>> HydrateProductLocationsAsync(List<ProductLocation> productLocations)
        {
            Dictionary<Guid, Product> productMap = (await HydrateProductsAsync(await _products.GetAllAsync())).ToDictionary(p => p.ProductID);
            Dictionary<Guid, Location> locationMap = (await _locations.GetAllAsync()).ToDictionary(l => l.LocationID);

            foreach (ProductLocation item in productLocations)
            {
                productMap.TryGetValue(item.ProductID, out Product product);
                locationMap.TryGetValue(item.LocationID, out Location location);
                item.Product = product;
                item.Location = location;
            }

            return productLocations;
        }

        private async Task<List<Location>> HydrateLocationsAsync(List<Location> locations)
        {
            List<ProductLocation> hydratedProductLocations = await HydrateProductLocationsAsync(await _productLocations.GetAllAsync());

            foreach (Location item in locations)
            {
                item.ProductLocations = hydratedProductLocations
                    .Where(pl => pl.LocationID == item.LocationID)
                    .OrderBy(pl => pl.Product?.ProductName)
                    .ToList();
            }

            return locations;
        }

        private async Task<List<Defective>> HydrateDefectivesAsync(List<Defective> defectives)
        {
            Dictionary<Guid, Product> productMap = (await HydrateProductsAsync(await _products.GetAllAsync())).ToDictionary(p => p.ProductID);

            foreach (Defective item in defectives)
            {
                productMap.TryGetValue(item.ProductID, out Product product);
                item.Product = product;
            }

            return defectives;
        }

        private async Task<List<Log>> HydrateLogsAsync(List<Log> logs)
        {
            Dictionary<Guid, Staff> staffMap = (await HydrateStaffAsync(await _staff.GetAllAsync())).ToDictionary(s => s.StaffID);

            foreach (Log item in logs)
            {
                staffMap.TryGetValue(item.StaffID, out Staff staff);
                item.Staff = staff;
            }

            return logs;
        }

        private async Task<List<InternalMessage>> HydrateMessagesAsync(List<InternalMessage> messages)
        {
            Dictionary<Guid, Staff> staffMap = (await HydrateStaffAsync(await _staff.GetAllAsync())).ToDictionary(s => s.StaffID);

            foreach (InternalMessage item in messages)
            {
                staffMap.TryGetValue(item.SenderStaffID, out Staff sender);
                staffMap.TryGetValue(item.RecipientStaffID, out Staff recipient);
                item.SenderStaff = sender;
                item.RecipientStaff = recipient;
            }

            return messages;
        }
    }
}
