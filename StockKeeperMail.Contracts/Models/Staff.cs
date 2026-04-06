using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет сотрудника, работающего в системе.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Staff
    {
        /// <summary>
        /// Уникальный идентификатор сотрудника.
        /// </summary>
        [Key]
        [BsonId]
        public Guid StaffID { get; set; }

        /// <summary>
        /// Уникальный идентификатор роли.
        /// </summary>
        public Guid RoleID { get; set; }
        /// <summary>
        /// Имя сотрудника.
        /// </summary>
        public string StaffFirstName { get; set; }
        /// <summary>
        /// Фамилия сотрудника.
        /// </summary>
        public string StaffLastName { get; set; }
        /// <summary>
        /// Адрес сотрудника.
        /// </summary>
        public string StaffAddress { get; set; }
        /// <summary>
        /// Контактный телефон сотрудника.
        /// </summary>
        public string StaffPhone { get; set; }
        /// <summary>
        /// Электронная почта сотрудника.
        /// </summary>
        public string StaffEmail { get; set; }
        /// <summary>
        /// Логин сотрудника для входа в систему.
        /// </summary>
        public string StaffUsername { get; set; }
        /// <summary>
        /// Пароль сотрудника для входа в систему.
        /// </summary>
        public string StaffPassword { get; set; }

        /// <summary>
        /// Связанная роль сотрудника.
        /// </summary>
        [BsonIgnore]
        public Role Role { get; set; }

        /// <summary>
        /// Коллекция сообщений, отправленных сотрудником.
        /// </summary>
        [BsonIgnore]
        public ICollection<InternalMessage> SentMessages { get; set; }

        /// <summary>
        /// Коллекция сообщений, полученных сотрудником.
        /// </summary>
        [BsonIgnore]
        public ICollection<InternalMessage> ReceivedMessages { get; set; }
    }
}
