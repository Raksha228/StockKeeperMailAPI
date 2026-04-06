using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace StockKeeperMail.Desktop.Api
{
    /// <summary>
    /// Вспомогательные методы для поиска ключевых свойств сущностей.
    /// </summary>
    public static class EntityKeyHelper
    {
        public static IEnumerable<PropertyInfo> GetKeyProperties(Type entityType)
        {
            return entityType
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => Attribute.IsDefined(p, typeof(KeyAttribute)))
                .OrderBy(p => p.Name);
        }

        public static object GetSingleKeyValue<TEntity>(TEntity entity)
        {
            PropertyInfo keyProperty = GetKeyProperties(typeof(TEntity)).Single();
            return keyProperty.GetValue(entity);
        }

        public static TEntity FindBySingleKey<TEntity>(IEnumerable<TEntity> entities, object id) where TEntity : class
        {
            PropertyInfo keyProperty = GetKeyProperties(typeof(TEntity)).Single();

            return entities.SingleOrDefault(entity =>
            {
                object value = keyProperty.GetValue(entity);
                return Equals(value, id);
            });
        }
    }
}
