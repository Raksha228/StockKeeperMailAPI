using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет товар, доступный для хранения и оформления в заказах.
    /// </summary>
    public class Product
    {
        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        [Key]
        public Guid ProductID { get; set; }

        /// <summary>
        /// Уникальный идентификатор поставщика.
        /// </summary>
        public Guid SupplierID { get; set; }
        /// <summary>
        /// Уникальный идентификатор категории.
        /// </summary>
        public Guid CategoryID { get; set; }
        /// <summary>
        /// Наименование товара.
        /// </summary>
        public string ProductName { get; set; }
        /// <summary>
        /// Артикул товара.
        /// </summary>
        public string ProductSKU { get; set; }
        /// <summary>
        /// Единица измерения товара.
        /// </summary>
        public string ProductUnit { get; set; }

        /// <summary>
        /// Цена товара.
        /// </summary>
        public decimal ProductPrice { get; set; }

        /// <summary>
        /// Количество товара.
        /// </summary>
        public int ProductQuantity { get; set; }
        /// <summary>
        /// Статус доступности товара.
        /// </summary>
        public string ProductAvailability { get; set; }

        /// <summary>
        /// Связанный поставщик.
        /// </summary>
        public Supplier Supplier { get; set; }

        /// <summary>
        /// Связанная категория.
        /// </summary>
        public Category Category { get; set; }

        /// <summary>
        /// Связанная коллекция размещений товаров по локациям.
        /// </summary>
        public ICollection<ProductLocation> ProductLocations { get; set; }

        /// <summary>
        /// Связанная коллекция строк заказа.
        /// </summary>
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
