using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет класс Location.
    /// </summary>
    public class Location
    {
        [Key]
        public Guid LocationID { get; set; }
        public string LocationName { get; set; }
        public ICollection<ProductLocation> ProductLocations { get; set; }
    }
}
