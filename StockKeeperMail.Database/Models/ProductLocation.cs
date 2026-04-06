using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс ProductLocation.
    /// </summary>
    public class ProductLocation
    {
        [Key]
        public Guid LocationID { get; set; }
        [Key]
        public Guid ProductID { get; set; }
        public int ProductQuantity { get; set; }
        public Location Location { get; set; }
        public Product Product { get; set; }
    }
}
