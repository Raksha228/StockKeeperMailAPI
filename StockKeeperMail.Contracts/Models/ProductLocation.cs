using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет связь между товаром и локацией его хранения.
    /// </summary>
    public class ProductLocation
    {
        /// <summary>
        /// Уникальный идентификатор локации.
        /// </summary>
        [Key]
        public Guid LocationID { get; set; }

        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        [Key]
        public Guid ProductID { get; set; }

        /// <summary>
        /// Количество товара.
        /// </summary>
        public int ProductQuantity { get; set; }

        /// <summary>
        /// Связанная локация.
        /// </summary>
        public Location Location { get; set; }

        /// <summary>
        /// Связанный товар.
        /// </summary>
        public Product Product { get; set; }
    }
}
