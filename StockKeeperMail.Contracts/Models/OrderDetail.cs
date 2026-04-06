using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет строку заказа с товаром, количеством и суммой.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class OrderDetail
    {
        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        [Key]
        public Guid ProductID { get; set; }

        /// <summary>
        /// Уникальный идентификатор заказа.
        /// </summary>
        [Key]
        public Guid OrderID { get; set; }

        /// <summary>
        /// Количество товара в строке заказа.
        /// </summary>
        public int OrderDetailQuantity { get; set; }

        /// <summary>
        /// Сумма по строке заказа.
        /// </summary>
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal OrderDetailAmount { get; set; }

        /// <summary>
        /// Связанный товар.
        /// </summary>
        [BsonIgnore]
        public Product Product { get; set; }

        /// <summary>
        /// Связанный заказ.
        /// </summary>
        [BsonIgnore]
        public Order Order { get; set; }
    }
}
