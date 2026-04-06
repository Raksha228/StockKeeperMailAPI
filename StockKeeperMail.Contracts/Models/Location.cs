using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Location.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Location
    {
        [Key]
        [BsonId]
        public Guid LocationID { get; set; }

        public string LocationName { get; set; }

        [BsonIgnore]
        public ICollection<ProductLocation> ProductLocations { get; set; }
    }
}
