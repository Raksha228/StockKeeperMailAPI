using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет заказ клиента с общей суммой и статусом доставки.
    /// </summary>
    public class Order
    {
        /// <summary>
        /// Уникальный идентификатор заказа.
        /// </summary>
        [Key]
        public Guid OrderID { get; set; }

        /// <summary>
        /// Уникальный идентификатор клиента.
        /// </summary>
        public Guid CustomerID { get; set; }
        /// <summary>
        /// Дата оформления заказа.
        /// </summary>
        public DateTime OrderDate { get; set; }
        /// <summary>
        /// Статус доставки заказа.
        /// </summary>
        public string DeliveryStatus { get; set; }

        /// <summary>
        /// Внешний номер заказа с сайта или другого канала продаж.
        /// Используется как номер заказа в счёте на оплату.
        /// </summary>
        public string ExternalOrderNumber { get; set; }

        /// <summary>
        /// Признак того, что заказ был оформлен онлайн.
        /// </summary>
        public bool IsOnlineOrder { get; set; }

        /// <summary>
        /// Адрес доставки заказа покупателю.
        /// </summary>
        public string DeliveryAddress { get; set; }

        /// <summary>
        /// Итоговая сумма заказа.
        /// </summary>
        public decimal OrderTotal { get; set; }

        /// <summary>
        /// Связанный клиент.
        /// </summary>
        public Customer Customer { get; set; }

        /// <summary>
        /// Связанная коллекция строк заказа.
        /// </summary>
        public List<OrderDetail> OrderDetails { get; set; }
    }
}
