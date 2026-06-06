using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет класс OrderDetailViewModel.
    /// </summary>
    public class OrderDetailViewModel
    {
        private readonly OrderDetail _orderDetail;
        public OrderDetail OrderDetail => _orderDetail;
        public string ProductID => _orderDetail?.ProductID.ToString() ?? string.Empty;
        public string OrderID => _orderDetail?.OrderID.ToString() ?? string.Empty;
        public string OrderDetailQuantity => _orderDetail?.OrderDetailQuantity.ToString() ?? "0";
        public string OrderDetailAmount => _orderDetail?.OrderDetailAmount.ToString() ?? "0";
        public ProductViewModel Product
        {
            get
            {
                if(_orderDetail?.Product != null)
                {
                    return new ProductViewModel(_orderDetail.Product);
                }
                return null;
            }
        }

        public OrderViewModel Order
        {
            get
            {
                if (_orderDetail?.Order != null)
                {
                    return new OrderViewModel(_orderDetail.Order);
                }
                return null;
            }
        }

        public OrderDetailViewModel(OrderDetail orderDetail)
        {
            _orderDetail = orderDetail ?? new OrderDetail();
        }
    }
}
