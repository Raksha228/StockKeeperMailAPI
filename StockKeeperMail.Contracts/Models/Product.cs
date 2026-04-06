using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет товар, доступный для хранения и оформления в заказах.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Product
    {
        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        [Key]
        [BsonId]
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
        [BsonRepresentation(BsonType.Decimal128)]
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
        [BsonIgnore]
        public Supplier Supplier { get; set; }

        /// <summary>
        /// Связанная категория.
        /// </summary>
        [BsonIgnore]
        public Category Category { get; set; }

        /// <summary>
        /// Связанная коллекция размещений товаров по локациям.
        /// </summary>
        [BsonIgnore]
        public ICollection<ProductLocation> ProductLocations { get; set; }

        /// <summary>
        /// Связанная коллекция строк заказа.
        /// </summary>
        [BsonIgnore]
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
