using System;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет приход товара от поставщика на выбранный склад.
    /// </summary>
    public class PurchaseReceipt
    {
        /// <summary>
        /// Уникальный идентификатор записи прихода товара.
        /// </summary>
        [Key]
        public Guid PurchaseReceiptID { get; set; }

        /// <summary>
        /// Уникальный идентификатор поставщика.
        /// </summary>
        public Guid SupplierID { get; set; }

        /// <summary>
        /// Уникальный идентификатор товара.
        /// </summary>
        public Guid ProductID { get; set; }

        /// <summary>
        /// Уникальный идентификатор склада, на который поступил товар.
        /// </summary>
        public Guid WarehouseID { get; set; }

        /// <summary>
        /// Внешний номер документа поставщика: накладная, УПД, счёт или закупочный заказ.
        /// </summary>
        public string DocumentNumber { get; set; }

        /// <summary>
        /// Количество поступившего товара.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Закупочная цена за единицу товара.
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// Общая сумма поступления.
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Дата и время регистрации закупки в системе.
        /// </summary>
        public DateTime PurchasedAt { get; set; }

        /// <summary>
        /// Комментарий к закупке.
        /// </summary>
        public string Comment { get; set; }

        /// <summary>
        /// Связанный поставщик.
        /// </summary>
        public Supplier Supplier { get; set; }

        /// <summary>
        /// Связанный товар.
        /// </summary>
        public Product Product { get; set; }

        /// <summary>
        /// Связанный склад.
        /// </summary>
        public Warehouse Warehouse { get; set; }
    }
}
