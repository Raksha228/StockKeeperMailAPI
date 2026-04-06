using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StockKeeperMail.Database.Models;
using System;
using System.IO;
using System.Diagnostics;

namespace StockKeeperMail.Database.Data
{
    /// <summary>
    /// Представляет класс InventoryManagementContext.
    /// </summary>
    public class InventoryManagementContext : DbContext
    {
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Defective> Defectives { get; set; }
        public DbSet<ProductLocation> ProductLocations { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<InternalMessage> InternalMessages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string basePath = AppContext.BaseDirectory;
            string configPath = Path.Combine(basePath, "dbconfig.json");

            if (!File.Exists(configPath))
            {
                configPath = Path.Combine(Directory.GetCurrentDirectory(), "dbconfig.json");
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.GetDirectoryName(configPath))
                .AddJsonFile(Path.GetFileName(configPath), optional: false, reloadOnChange: false)
                .Build();

            string connectionString = configuration.GetConnectionString("DB");

            Debug.WriteLine("=== DB CONFIG PATH === " + configPath);
            Debug.WriteLine("=== CONNECTION STRING === " + connectionString);

            optionsBuilder.UseSqlServer(connectionString);
            optionsBuilder.EnableSensitiveDataLogging(true);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<OrderDetail>()
                .HasKey(od => new { od.ProductID, od.OrderID });

            modelBuilder
                .Entity<ProductLocation>()
                .HasKey(pl => new { pl.ProductID, pl.LocationID });

            modelBuilder
                .Entity<Order>()
                .Property(o => o.OrderTotal)
                .HasPrecision(18, 2);

            modelBuilder
                .Entity<OrderDetail>()
                .Property(od => od.OrderDetailAmount)
                .HasPrecision(18, 2);

            modelBuilder
                .Entity<Product>()
                .Property(p => p.ProductPrice)
                .HasPrecision(18, 2);

            modelBuilder
                .Entity<Warehouse>()
                .Property(w => w.WarehouseVat)
                .HasPrecision(18, 2);

            modelBuilder
                .Entity<InternalMessage>()
                .ToTable("InternalMessages", "dbo");

            modelBuilder
                .Entity<InternalMessage>()
                .HasOne(im => im.SenderStaff)
                .WithMany(s => s.SentMessages)
                .HasForeignKey(im => im.SenderStaffID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<InternalMessage>()
                .HasOne(im => im.RecipientStaff)
                .WithMany(s => s.ReceivedMessages)
                .HasForeignKey(im => im.RecipientStaffID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}