using StockKeeperMail.Api.Data;
using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Services
{
    /// <summary>
    /// Наполняет сущности связанными данными перед отправкой их клиенту.
    /// Навигационные свойства в MongoDB не дублируются и формируются на лету.
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

        /// <summary>
        /// Инициализирует сервис гидратации сущностей.
        /// </summary>
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

        /// <summary>
        /// Заполняет навигационные свойства для списка сущностей указанного типа.
        /// </summary>
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
            if (typeof(TEntity) == typeof(PurchaseReceipt))
                return (await HydratePurchaseReceiptsAsync(entities.Cast<PurchaseReceipt>().ToList())).Cast<TEntity>().ToList();
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
            Dictionary<Guid, Role> roleMap = (await _roles.GetAllAsync()).GroupBy(r => r.RoleID).Select(g => g.First()).ToDictionary(r => r.RoleID);

            foreach (Staff item in staff)
            {
                roleMap.TryGetValue(item.RoleID, out Role role);
                item.Role = role ?? CreateMissingRole(item.RoleID);
            }

            return staff;
        }

        private async Task<List<Product>> HydrateProductsAsync(List<Product> products)
        {
            Dictionary<Guid, Supplier> supplierMap = (await _suppliers.GetAllAsync()).GroupBy(s => s.SupplierID).Select(g => g.First()).ToDictionary(s => s.SupplierID);
            Dictionary<Guid, Category> categoryMap = (await _categories.GetAllAsync()).GroupBy(c => c.CategoryID).Select(g => g.First()).ToDictionary(c => c.CategoryID);

            foreach (Product item in products)
            {
                supplierMap.TryGetValue(item.SupplierID, out Supplier supplier);
                categoryMap.TryGetValue(item.CategoryID, out Category category);
                item.Supplier = supplier ?? CreateMissingSupplier(item.SupplierID);
                item.Category = category ?? CreateMissingCategory(item.CategoryID);
            }

            return products;
        }

        private async Task<List<Customer>> HydrateCustomersAsync(List<Customer> customers)
        {
            Dictionary<Guid, Staff> staffMap = (await HydrateStaffAsync(await _staff.GetAllAsync())).GroupBy(s => s.StaffID).Select(g => g.First()).ToDictionary(s => s.StaffID);

            foreach (Customer item in customers)
            {
                staffMap.TryGetValue(item.StaffID, out Staff staff);
                item.Staff = staff ?? CreateMissingStaff(item.StaffID);
            }

            return customers;
        }

        private async Task<List<OrderDetail>> HydrateOrderDetailsAsync(List<OrderDetail> orderDetails)
        {
            Dictionary<Guid, Product> productMap = (await HydrateProductsAsync(await _products.GetAllAsync())).GroupBy(p => p.ProductID).Select(g => g.First()).ToDictionary(p => p.ProductID);
            Dictionary<Guid, Order> orderMap = (await _orders.GetAllAsync()).GroupBy(o => o.OrderID).Select(g => g.First()).ToDictionary(o => o.OrderID);

            foreach (OrderDetail item in orderDetails)
            {
                productMap.TryGetValue(item.ProductID, out Product product);
                orderMap.TryGetValue(item.OrderID, out Order order);
                item.Product = product ?? CreateMissingProduct(item.ProductID);
                item.Order = order;
            }

            return orderDetails;
        }

        private async Task<List<Order>> HydrateOrdersAsync(List<Order> orders)
        {
            Dictionary<Guid, Customer> customerMap = (await HydrateCustomersAsync(await _customers.GetAllAsync())).GroupBy(c => c.CustomerID).Select(g => g.First()).ToDictionary(c => c.CustomerID);
            List<OrderDetail> hydratedOrderDetails = await HydrateOrderDetailsAsync(await _orderDetails.GetAllAsync());

            foreach (Order item in orders)
            {
                customerMap.TryGetValue(item.CustomerID, out Customer customer);
                item.Customer = customer ?? CreateMissingCustomer(item.CustomerID);
                item.OrderDetails = hydratedOrderDetails
                    .Where(od => od.OrderID == item.OrderID)
                    .OrderBy(od => od.Product?.ProductName)
                    .ToList();
            }

            return orders;
        }

        private async Task<List<ProductLocation>> HydrateProductLocationsAsync(List<ProductLocation> productLocations)
        {
            Dictionary<Guid, Product> productMap = (await HydrateProductsAsync(await _products.GetAllAsync())).GroupBy(p => p.ProductID).Select(g => g.First()).ToDictionary(p => p.ProductID);
            Dictionary<Guid, Location> locationMap = (await _locations.GetAllAsync()).GroupBy(l => l.LocationID).Select(g => g.First()).ToDictionary(l => l.LocationID);

            foreach (ProductLocation item in productLocations)
            {
                productMap.TryGetValue(item.ProductID, out Product product);
                locationMap.TryGetValue(item.LocationID, out Location location);
                item.Product = product ?? CreateMissingProduct(item.ProductID);
                item.Location = location ?? CreateMissingLocation(item.LocationID);
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


        private async Task<List<PurchaseReceipt>> HydratePurchaseReceiptsAsync(List<PurchaseReceipt> purchaseReceipts)
        {
            Dictionary<Guid, Supplier> supplierMap = (await _suppliers.GetAllAsync()).GroupBy(s => s.SupplierID).Select(g => g.First()).ToDictionary(s => s.SupplierID);
            Dictionary<Guid, Product> productMap = (await HydrateProductsAsync(await _products.GetAllAsync())).GroupBy(p => p.ProductID).Select(g => g.First()).ToDictionary(p => p.ProductID);
            Dictionary<Guid, Warehouse> warehouseMap = (await _warehouses.GetAllAsync()).GroupBy(w => w.WarehouseID).Select(g => g.First()).ToDictionary(w => w.WarehouseID);

            foreach (PurchaseReceipt item in purchaseReceipts)
            {
                supplierMap.TryGetValue(item.SupplierID, out Supplier supplier);
                productMap.TryGetValue(item.ProductID, out Product product);
                warehouseMap.TryGetValue(item.WarehouseID, out Warehouse warehouse);

                item.Supplier = supplier ?? CreateMissingSupplier(item.SupplierID);
                item.Product = product ?? CreateMissingProduct(item.ProductID);
                item.Warehouse = warehouse ?? CreateMissingWarehouse(item.WarehouseID);
            }

            return purchaseReceipts;
        }

        private async Task<List<Defective>> HydrateDefectivesAsync(List<Defective> defectives)
        {
            Dictionary<Guid, Product> productMap = (await HydrateProductsAsync(await _products.GetAllAsync())).GroupBy(p => p.ProductID).Select(g => g.First()).ToDictionary(p => p.ProductID);

            foreach (Defective item in defectives)
            {
                productMap.TryGetValue(item.ProductID, out Product product);
                item.Product = product ?? CreateMissingProduct(item.ProductID);
            }

            return defectives;
        }

        private async Task<List<Log>> HydrateLogsAsync(List<Log> logs)
        {
            Dictionary<Guid, Staff> staffMap = (await HydrateStaffAsync(await _staff.GetAllAsync())).GroupBy(s => s.StaffID).Select(g => g.First()).ToDictionary(s => s.StaffID);

            foreach (Log item in logs)
            {
                staffMap.TryGetValue(item.StaffID, out Staff staff);
                item.Staff = staff ?? CreateMissingStaff(item.StaffID);
            }

            return logs;
        }

        private async Task<List<InternalMessage>> HydrateMessagesAsync(List<InternalMessage> messages)
        {
            Dictionary<Guid, Staff> staffMap = (await HydrateStaffAsync(await _staff.GetAllAsync())).GroupBy(s => s.StaffID).Select(g => g.First()).ToDictionary(s => s.StaffID);

            foreach (InternalMessage item in messages)
            {
                staffMap.TryGetValue(item.SenderStaffID, out Staff sender);
                staffMap.TryGetValue(item.RecipientStaffID, out Staff recipient);
                item.SenderStaff = sender ?? CreateMissingStaff(item.SenderStaffID);
                item.RecipientStaff = recipient ?? CreateMissingStaff(item.RecipientStaffID);
            }

            return messages;
        }

        private static Role CreateMissingRole(Guid roleID)
        {
            return new Role
            {
                RoleID = roleID,
                RoleName = "Не найдена роль"
            };
        }

        private static Staff CreateMissingStaff(Guid staffID)
        {
            return new Staff
            {
                StaffID = staffID,
                StaffFirstName = "Неизвестный",
                StaffLastName = "сотрудник",
                StaffUsername = staffID == Guid.Empty ? string.Empty : staffID.ToString(),
                Role = CreateMissingRole(Guid.Empty)
            };
        }

        private static Customer CreateMissingCustomer(Guid customerID)
        {
            return new Customer
            {
                CustomerID = customerID,
                CustomerFirstname = "Неизвестный",
                CustomerLastname = "покупатель",
                CustomerAddress = string.Empty,
                CustomerPhone = string.Empty,
                CustomerEmail = string.Empty,
                Staff = CreateMissingStaff(Guid.Empty)
            };
        }

        private static Product CreateMissingProduct(Guid productID)
        {
            return new Product
            {
                ProductID = productID,
                ProductName = "Неизвестный товар",
                ProductSKU = string.Empty,
                ProductUnit = string.Empty,
                ProductAvailability = string.Empty,
                Supplier = CreateMissingSupplier(Guid.Empty),
                Category = CreateMissingCategory(Guid.Empty)
            };
        }

        private static Supplier CreateMissingSupplier(Guid supplierID)
        {
            return new Supplier
            {
                SupplierID = supplierID,
                SupplierName = "Неизвестный поставщик"
            };
        }

        private static Category CreateMissingCategory(Guid categoryID)
        {
            return new Category
            {
                CategoryID = categoryID,
                CategoryName = "Неизвестная категория"
            };
        }

        private static Warehouse CreateMissingWarehouse(Guid warehouseID)
        {
            return new Warehouse
            {
                WarehouseID = warehouseID,
                WarehouseName = "Неизвестный склад"
            };
        }

        private static Location CreateMissingLocation(Guid locationID)
        {
            return new Location
            {
                LocationID = locationID,
                LocationName = "Неизвестная ячейка"
            };
        }

    }
}
