using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Формирует фильтр MongoDB по ключевым свойствам сущности.
    /// </summary>
    public static class EntityKeyFilterBuilder
    {
        public static FilterDefinition<TEntity> Build<TEntity>(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            var keyProperties = GetKeyProperties(typeof(TEntity)).ToArray();
            if (keyProperties.Length == 0)
            {
                throw new InvalidOperationException($"Тип {typeof(TEntity).Name} не содержит свойств с атрибутом [Key].");
            }

            var filterBuilder = Builders<TEntity>.Filter;
            var filters = new List<FilterDefinition<TEntity>>();

            foreach (var property in keyProperties)
            {
                object value = property.GetValue(entity);
                filters.Add(filterBuilder.Eq(property.Name, value));
            }

            return filters.Count == 1 ? filters[0] : filterBuilder.And(filters);
        }

        public static IEnumerable<PropertyInfo> GetKeyProperties(Type type)
        {
            return type
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => Attribute.IsDefined(p, typeof(KeyAttribute)))
                .OrderBy(p => p.Name);
        }
    }
}
