using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Order.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Order
    {
        [Key]
        [BsonId]
        public Guid OrderID { get; set; }

        public Guid CustomerID { get; set; }
        public DateTime OrderDate { get; set; }
        public string DeliveryStatus { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal OrderTotal { get; set; }

        [BsonIgnore]
        public Customer Customer { get; set; }

        [BsonIgnore]
        public List<OrderDetail> OrderDetails { get; set; }
    }
}
