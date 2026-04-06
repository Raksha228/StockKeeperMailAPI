using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет заказ клиента с общей суммой и статусом доставки.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Order
    {
        /// <summary>
        /// Уникальный идентификатор заказа.
        /// </summary>
        [Key]
        [BsonId]
        public Guid OrderID { get; set; }

        /// <summary>
        /// Уникальный идентификатор клиента.
        /// </summary>
        public Guid CustomerID { get; set; }
        /// <summary>
        /// Дата оформления заказа.
        /// </summary>
        public DateTime OrderDate { get; set; }
        /// <summary>
        /// Статус доставки заказа.
        /// </summary>
        public string DeliveryStatus { get; set; }

        /// <summary>
        /// Итоговая сумма заказа.
        /// </summary>
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal OrderTotal { get; set; }

        /// <summary>
        /// Связанный клиент.
        /// </summary>
        [BsonIgnore]
        public Customer Customer { get; set; }

        /// <summary>
        /// Связанная коллекция строк заказа.
        /// </summary>
        [BsonIgnore]
        public List<OrderDetail> OrderDetails { get; set; }
    }
}
