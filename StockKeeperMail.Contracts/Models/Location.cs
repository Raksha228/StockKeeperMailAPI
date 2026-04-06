using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет локацию хранения товара внутри склада.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Location
    {
        /// <summary>
        /// Уникальный идентификатор локации.
        /// </summary>
        [Key]
        [BsonId]
        public Guid LocationID { get; set; }

        /// <summary>
        /// Наименование локации хранения.
        /// </summary>
        public string LocationName { get; set; }

        /// <summary>
        /// Связанная коллекция размещений товаров по локациям.
        /// </summary>
        [BsonIgnore]
        public ICollection<ProductLocation> ProductLocations { get; set; }
    }
}
