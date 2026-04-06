using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет склад или складской объект компании.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Warehouse
    {
        /// <summary>
        /// Уникальный идентификатор склада.
        /// </summary>
        [Key]
        [BsonId]
        public Guid WarehouseID { get; set; }

        /// <summary>
        /// Наименование склада.
        /// </summary>
        public string WarehouseName { get; set; }
        /// <summary>
        /// Адрес склада.
        /// </summary>
        public string WarehouseAddress { get; set; }
        /// <summary>
        /// Контактный телефон склада.
        /// </summary>
        public string WarehousePhone { get; set; }
        /// <summary>
        /// Электронная почта склада.
        /// </summary>
        public string WarehouseEmail { get; set; }

        /// <summary>
        /// Ставка НДС для склада.
        /// </summary>
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal WarehouseVat { get; set; }
    }
}
