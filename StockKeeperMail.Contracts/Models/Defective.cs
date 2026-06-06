using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет запись о бракованном или списанном товаре.
    /// </summary>
    public class Defective
    {
        /// <summary>
        /// Уникальный идентификатор записи о браке.
        /// </summary>
        [Key]
        public Guid DefectiveID { get; set; }

        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        public Guid ProductID { get; set; }
        /// <summary>
        /// Количество бракованного товара.
        /// </summary>
        public int Quantity { get; set; }
        /// <summary>
        /// Дата фиксации брака.
        /// </summary>
        public DateTime DateDeclared { get; set; }

        /// <summary>
        /// Связанный товар.
        /// </summary>
        public Product Product { get; set; }
    }
}
