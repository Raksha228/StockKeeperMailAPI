using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет внутреннее сообщение между сотрудниками системы.
    /// </summary>
    public class InternalMessage
    {
        /// <summary>
        /// Уникальный идентификатор внутреннего сообщения.
        /// </summary>
        [Key]
        public Guid InternalMessageID { get; set; }

        /// <summary>
        /// Идентификатор связанной сущности SenderStaff.
        /// </summary>
        public Guid SenderStaffID { get; set; }
        /// <summary>
        /// Идентификатор связанной сущности RecipientStaff.
        /// </summary>
        public Guid RecipientStaffID { get; set; }

        /// <summary>
        /// Тема внутреннего сообщения.
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string Subject { get; set; }

        /// <summary>
        /// Текст внутреннего сообщения.
        /// </summary>
        [Required]
        public string Body { get; set; }

        /// <summary>
        /// Дата и время отправки сообщения.
        /// </summary>
        public DateTime SentAt { get; set; }
        /// <summary>
        /// Признак того, что сообщение прочитано.
        /// </summary>
        public bool IsRead { get; set; }

        /// <summary>
        /// Сотрудник-отправитель сообщения.
        /// </summary>
        public Staff SenderStaff { get; set; }

        /// <summary>
        /// Сотрудник-получатель сообщения.
        /// </summary>
        public Staff RecipientStaff { get; set; }
    }
}
