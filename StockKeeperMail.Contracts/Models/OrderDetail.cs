using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс OrderDetail.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class OrderDetail
    {
        [Key]
        public Guid ProductID { get; set; }

        [Key]
        public Guid OrderID { get; set; }

        public int OrderDetailQuantity { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal OrderDetailAmount { get; set; }

        [BsonIgnore]
        public Product Product { get; set; }

        [BsonIgnore]
        public Order Order { get; set; }
    }
}
