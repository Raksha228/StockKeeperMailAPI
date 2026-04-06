using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс ProductLocation.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class ProductLocation
    {
        [Key]
        public Guid LocationID { get; set; }

        [Key]
        public Guid ProductID { get; set; }

        public int ProductQuantity { get; set; }

        [BsonIgnore]
        public Location Location { get; set; }

        [BsonIgnore]
        public Product Product { get; set; }
    }
}
