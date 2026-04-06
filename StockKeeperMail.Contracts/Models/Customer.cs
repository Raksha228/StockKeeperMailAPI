using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет клиента, оформляющего заказы в системе.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Customer
    {
        /// <summary>
        /// Уникальный идентификатор клиента.
        /// </summary>
        [Key]
        [BsonId]
        public Guid CustomerID { get; set; }

        /// <summary>
        /// Уникальный идентификатор сотрудника.
        /// </summary>
        public Guid StaffID { get; set; }
        /// <summary>
        /// Имя клиента.
        /// </summary>
        public string CustomerFirstname { get; set; }
        /// <summary>
        /// Фамилия клиента.
        /// </summary>
        public string CustomerLastname { get; set; }
        /// <summary>
        /// Адрес клиента.
        /// </summary>
        public string CustomerAddress { get; set; }
        /// <summary>
        /// Контактный телефон клиента.
        /// </summary>
        public string CustomerPhone { get; set; }
        /// <summary>
        /// Электронная почта клиента.
        /// </summary>
        public string CustomerEmail { get; set; }

        /// <summary>
        /// Связанный сотрудник.
        /// </summary>
        [BsonIgnore]
        public Staff Staff { get; set; }
    }
}
