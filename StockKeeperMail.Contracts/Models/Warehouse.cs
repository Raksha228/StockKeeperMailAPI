using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Warehouse.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Warehouse
    {
        [Key]
        [BsonId]
        public Guid WarehouseID { get; set; }

        public string WarehouseName { get; set; }
        public string WarehouseAddress { get; set; }
        public string WarehousePhone { get; set; }
        public string WarehouseEmail { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal WarehouseVat { get; set; }
    }
}
