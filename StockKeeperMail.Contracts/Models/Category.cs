using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет категорию товаров, используемую для группировки номенклатуры.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Category
    {
        /// <summary>
        /// Уникальный идентификатор категории.
        /// </summary>
        [Key]
        [BsonId]
        public Guid CategoryID { get; set; }

        /// <summary>
        /// Наименование категории.
        /// </summary>
        public string CategoryName { get; set; }
        /// <summary>
        /// Текущий статус категории.
        /// </summary>
        public string CategoryStatus { get; set; }
        /// <summary>
        /// Описание категории.
        /// </summary>
        public string CategoryDescription { get; set; }

        /// <summary>
        /// Связанная коллекция товаров.
        /// </summary>
        [BsonIgnore]
        public ICollection<Product> Products { get; set; }
    }
}
