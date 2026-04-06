using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет связь между товаром и локацией его хранения.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class ProductLocation
    {
        /// <summary>
        /// Уникальный идентификатор локации.
        /// </summary>
        [Key]
        public Guid LocationID { get; set; }

        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        [Key]
        public Guid ProductID { get; set; }

        /// <summary>
        /// Количество товара.
        /// </summary>
        public int ProductQuantity { get; set; }

        /// <summary>
        /// Связанная локация.
        /// </summary>
        [BsonIgnore]
        public Location Location { get; set; }

        /// <summary>
        /// Связанный товар.
        /// </summary>
        [BsonIgnore]
        public Product Product { get; set; }
    }
}
