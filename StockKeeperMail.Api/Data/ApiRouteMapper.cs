using StockKeeperMail.Database.Models;
using System;
using System.Collections.Generic;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Сопоставляет тип сущности с именем маршрута и коллекции MongoDB.
    /// </summary>
    public static class ApiRouteMapper
    {
        private static readonly IReadOnlyDictionary<Type, string> Routes = new Dictionary<Type, string>
        {
            [typeof(Role)] = "roles",
            [typeof(Category)] = "categories",
            [typeof(Warehouse)] = "warehouses",
            [typeof(Supplier)] = "suppliers",
            [typeof(Staff)] = "staff",
            [typeof(Product)] = "products",
            [typeof(Order)] = "orders",
            [typeof(OrderDetail)] = "order-details",
            [typeof(Location)] = "locations",
            [typeof(Customer)] = "customers",
            [typeof(Defective)] = "defectives",
            [typeof(ProductLocation)] = "product-locations",
            [typeof(Log)] = "logs",
            [typeof(InternalMessage)] = "messages"
        };

        /// <summary>
        /// Возвращает маршрут для указанного типа сущности.
        /// </summary>
        public static string GetRoute<TEntity>()
        {
            if (Routes.TryGetValue(typeof(TEntity), out string route))
            {
                return route;
            }

            throw new InvalidOperationException($"Для типа {typeof(TEntity).Name} не зарегистрирован маршрут API.");
        }
    }
}
