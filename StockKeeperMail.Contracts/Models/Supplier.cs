using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Supplier.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Supplier
    {
        [Key]
        [BsonId]
        public Guid SupplierID { get; set; }

        public string SupplierName { get; set; }
        public string SupplierAddress { get; set; }
        public string SupplierPhone { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierStatus { get; set; }

        [BsonIgnore]
        public ICollection<Product> Products { get; set; }
    }
}
