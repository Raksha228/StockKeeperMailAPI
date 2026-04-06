using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Staff.
    /// </summary>
    public class Staff
    {
        [Key]
        public Guid StaffID { get; set; }
        public Guid RoleID { get; set; }
        public string StaffFirstName { get; set; }
        public string StaffLastName { get; set; }
        public string StaffAddress { get; set; }
        public string StaffPhone { get; set; }
        public string StaffEmail { get; set; }
        public string StaffUsername { get; set; }
        public string StaffPassword { get; set; }
        public Role Role { get; set; }

        public ICollection<InternalMessage> SentMessages { get; set; }
        public ICollection<InternalMessage> ReceivedMessages { get; set; }

    }
}