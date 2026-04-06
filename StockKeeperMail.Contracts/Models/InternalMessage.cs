using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс InternalMessage.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class InternalMessage
    {
        [Key]
        [BsonId]
        public Guid InternalMessageID { get; set; }

        public Guid SenderStaffID { get; set; }
        public Guid RecipientStaffID { get; set; }

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; }

        [Required]
        public string Body { get; set; }

        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }

        [BsonIgnore]
        public Staff SenderStaff { get; set; }

        [BsonIgnore]
        public Staff RecipientStaff { get; set; }
    }
}
