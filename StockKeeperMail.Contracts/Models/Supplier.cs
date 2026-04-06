using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет поставщика товаров.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Supplier
    {
        /// <summary>
        /// Уникальный идентификатор поставщика.
        /// </summary>
        [Key]
        [BsonId]
        public Guid SupplierID { get; set; }

        /// <summary>
        /// Наименование поставщика.
        /// </summary>
        public string SupplierName { get; set; }
        /// <summary>
        /// Адрес поставщика.
        /// </summary>
        public string SupplierAddress { get; set; }
        /// <summary>
        /// Контактный телефон поставщика.
        /// </summary>
        public string SupplierPhone { get; set; }
        /// <summary>
        /// Электронная почта поставщика.
        /// </summary>
        public string SupplierEmail { get; set; }
        /// <summary>
        /// Текущий статус поставщика.
        /// </summary>
        public string SupplierStatus { get; set; }

        /// <summary>
        /// Связанная коллекция товаров.
        /// </summary>
        [BsonIgnore]
        public ICollection<Product> Products { get; set; }
    }
}
