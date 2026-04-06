using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Product.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Product
    {
        [Key]
        [BsonId]
        public Guid ProductID { get; set; }

        public Guid SupplierID { get; set; }
        public Guid CategoryID { get; set; }
        public string ProductName { get; set; }
        public string ProductSKU { get; set; }
        public string ProductUnit { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal ProductPrice { get; set; }

        public int ProductQuantity { get; set; }
        public string ProductAvailability { get; set; }

        [BsonIgnore]
        public Supplier Supplier { get; set; }

        [BsonIgnore]
        public Category Category { get; set; }

        [BsonIgnore]
        public ICollection<ProductLocation> ProductLocations { get; set; }

        [BsonIgnore]
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
