using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет запись журнала действий сотрудников в системе.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Log
    {
        /// <summary>
        /// Уникальный идентификатор записи журнала.
        /// </summary>
        [Key]
        [BsonId]
        public Guid LogID { get; set; }

        /// <summary>
        /// Уникальный идентификатор сотрудника.
        /// </summary>
        public Guid StaffID { get; set; }
        /// <summary>
        /// Категория записи журнала.
        /// </summary>
        public string LogCategory { get; set; }
        /// <summary>
        /// Тип выполненного действия.
        /// </summary>
        public string ActionType { get; set; }
        /// <summary>
        /// Подробности зафиксированного действия.
        /// </summary>
        public string LogDetails { get; set; }
        /// <summary>
        /// Дата и время создания записи журнала.
        /// </summary>
        public DateTime DateTime { get; set; }

        /// <summary>
        /// Связанный сотрудник.
        /// </summary>
        [BsonIgnore]
        public Staff Staff { get; set; }
    }
}
