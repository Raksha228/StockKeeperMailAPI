using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Category.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Category
    {
        [Key]
        [BsonId]
        public Guid CategoryID { get; set; }

        public string CategoryName { get; set; }
        public string CategoryStatus { get; set; }
        public string CategoryDescription { get; set; }

        [BsonIgnore]
        public ICollection<Product> Products { get; set; }
    }
}
