using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Defective.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Defective
    {
        [Key]
        [BsonId]
        public Guid DefectiveID { get; set; }

        public Guid ProductID { get; set; }
        public int Quantity { get; set; }
        public DateTime DateDeclared { get; set; }

        [BsonIgnore]
        public Product Product { get; set; }
    }
}
