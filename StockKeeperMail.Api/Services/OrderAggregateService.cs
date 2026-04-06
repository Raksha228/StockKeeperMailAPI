using MongoDB.Driver;
using StockKeeperMail.Api.Data;
using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Services
{
    /// <summary>
    /// Сервис для сохранения заказа как агрегата:
    /// сам заказ, строки заказа и измененные остатки товаров.
    /// </summary>
    public class OrderAggregateService
    {
        private readonly MongoRepository<Order> _orders;
        private readonly MongoRepository<OrderDetail> _orderDetails;
        private readonly MongoRepository<Product> _products;
        private readonly EntityHydrationService _hydrationService;

        public OrderAggregateService(
            MongoRepository<Order> orders,
            MongoRepository<OrderDetail> orderDetails,
            MongoRepository<Product> products,
            EntityHydrationService hydrationService)
        {
            _orders = orders;
            _orderDetails = orderDetails;
            _products = products;
            _hydrationService = hydrationService;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _hydrationService.HydrateAsync(await _orders.GetAllAsync());
        }

        public async Task InsertAsync(Order order)
        {
            await SaveAggregateAsync(order, isNew: true);
        }

        public async Task UpdateAsync(Order order)
        {
            await SaveAggregateAsync(order, isNew: false);
        }

        public async Task DeleteAsync(Order order)
        {
            await _orders.DeleteAsync(order);
            await _orderDetails.DeleteManyAsync(Builders<OrderDetail>.Filter.Eq(od => od.OrderID, order.OrderID));
        }

        private async Task SaveAggregateAsync(Order order, bool isNew)
        {
            List<OrderDetail> currentOrderDetails = order.OrderDetails ?? new List<OrderDetail>();

            if (isNew)
            {
                await _orders.InsertAsync(CopyOrder(order));
            }
            else
            {
                await _orders.ReplaceAsync(CopyOrder(order));
            }

            await _orderDetails.DeleteManyAsync(Builders<OrderDetail>.Filter.Eq(od => od.OrderID, order.OrderID));

            if (currentOrderDetails.Count > 0)
            {
                List<OrderDetail> sanitizedDetails = currentOrderDetails
                    .Select(CopyOrderDetail)
                    .ToList();

                await _orderDetails.InsertManyAsync(sanitizedDetails);
            }

            IEnumerable<Product> changedProducts = currentOrderDetails
                .Where(od => od.Product != null)
                .Select(od => od.Product)
                .GroupBy(p => p.ProductID)
                .Select(g => g.First());

            foreach (Product product in changedProducts)
            {
                await _products.ReplaceAsync(CopyProduct(product));
            }
        }

        private static Order CopyOrder(Order order)
        {
            return new Order
            {
                OrderID = order.OrderID,
                CustomerID = order.CustomerID,
                OrderDate = order.OrderDate,
                DeliveryStatus = order.DeliveryStatus,
                OrderTotal = order.OrderTotal
            };
        }

        private static OrderDetail CopyOrderDetail(OrderDetail orderDetail)
        {
            return new OrderDetail
            {
                OrderID = orderDetail.OrderID,
                ProductID = orderDetail.ProductID,
                OrderDetailQuantity = orderDetail.OrderDetailQuantity,
                OrderDetailAmount = orderDetail.OrderDetailAmount
            };
        }

        private static Product CopyProduct(Product product)
        {
            return new Product
            {
                ProductID = product.ProductID,
                SupplierID = product.SupplierID,
                CategoryID = product.CategoryID,
                ProductName = product.ProductName,
                ProductSKU = product.ProductSKU,
                ProductUnit = product.ProductUnit,
                ProductPrice = product.ProductPrice,
                ProductQuantity = product.ProductQuantity,
                ProductAvailability = product.ProductAvailability
            };
        }
    }
}
