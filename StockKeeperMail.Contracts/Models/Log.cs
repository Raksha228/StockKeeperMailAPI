using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Log.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Log
    {
        [Key]
        [BsonId]
        public Guid LogID { get; set; }

        public Guid StaffID { get; set; }
        public string LogCategory { get; set; }
        public string ActionType { get; set; }
        public string LogDetails { get; set; }
        public DateTime DateTime { get; set; }

        [BsonIgnore]
        public Staff Staff { get; set; }
    }
}
