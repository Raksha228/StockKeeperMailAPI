using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс InternalMessage.
    /// </summary>
    public class InternalMessage
    {
        [Key]
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

        public Staff SenderStaff { get; set; }

        public Staff RecipientStaff { get; set; }
    }
}
