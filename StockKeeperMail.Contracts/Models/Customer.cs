using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Customer.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Customer
    {
        [Key]
        [BsonId]
        public Guid CustomerID { get; set; }

        public Guid StaffID { get; set; }
        public string CustomerFirstname { get; set; }
        public string CustomerLastname { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerEmail { get; set; }

        [BsonIgnore]
        public Staff Staff { get; set; }
    }
}
