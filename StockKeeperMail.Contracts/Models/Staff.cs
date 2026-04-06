using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Staff.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Staff
    {
        [Key]
        [BsonId]
        public Guid StaffID { get; set; }

        public Guid RoleID { get; set; }
        public string StaffFirstName { get; set; }
        public string StaffLastName { get; set; }
        public string StaffAddress { get; set; }
        public string StaffPhone { get; set; }
        public string StaffEmail { get; set; }
        public string StaffUsername { get; set; }
        public string StaffPassword { get; set; }

        [BsonIgnore]
        public Role Role { get; set; }

        [BsonIgnore]
        public ICollection<InternalMessage> SentMessages { get; set; }

        [BsonIgnore]
        public ICollection<InternalMessage> ReceivedMessages { get; set; }
    }
}
