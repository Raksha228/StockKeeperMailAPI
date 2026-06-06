using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет строку заказа с товаром, количеством и суммой.
    /// </summary>
    public class OrderDetail
    {
        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        [Key]
        public Guid ProductID { get; set; }

        /// <summary>
        /// Уникальный идентификатор заказа.
        /// </summary>
        [Key]
        public Guid OrderID { get; set; }

        /// <summary>
        /// Количество товара в строке заказа.
        /// </summary>
        public int OrderDetailQuantity { get; set; }

        /// <summary>
        /// Сумма по строке заказа.
        /// </summary>
        public decimal OrderDetailAmount { get; set; }

        /// <summary>
        /// Связанный товар.
        /// </summary>
        public Product Product { get; set; }

        /// <summary>
        /// Связанный заказ.
        /// </summary>
        public Order Order { get; set; }
    }
}
