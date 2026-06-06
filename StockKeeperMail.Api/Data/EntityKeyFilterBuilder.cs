using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Возвращает ключевые свойства сущностей и формирует описание SQL-фильтра по ключу.
    /// </summary>
    public static class EntityKeyFilterBuilder
    {
        /// <summary>
        /// Формирует описание фильтра по значениям ключевых свойств переданной сущности.
        /// Метод оставлен для совместимости с тестами и старым кодом, но больше не зависит от MongoDB.
        /// </summary>
        public static KeyFilter<TEntity> Build<TEntity>(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            PropertyInfo[] keyProperties = GetKeyProperties(typeof(TEntity)).ToArray();
            if (keyProperties.Length == 0)
            {
                throw new InvalidOperationException($"Тип {typeof(TEntity).Name} не содержит свойств с атрибутом [Key].");
            }

            Dictionary<string, object> values = keyProperties.ToDictionary(property => property.Name, property => property.GetValue(entity));
            return keyProperties.Length == 1
                ? new SimpleFilterDefinition<TEntity>(values)
                : new AndFilterDefinition<TEntity>(values);
        }

        /// <summary>
        /// Возвращает список публичных свойств, помеченных атрибутом Key.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetKeyProperties(Type type)
        {
            return type
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => Attribute.IsDefined(p, typeof(KeyAttribute)))
                .OrderBy(p => p.Name);
        }
    }

    public abstract class KeyFilter<TEntity>
    {
        protected KeyFilter(IReadOnlyDictionary<string, object> values)
        {
            Values = values;
        }

        public IReadOnlyDictionary<string, object> Values { get; }
    }

    public sealed class SimpleFilterDefinition<TEntity> : KeyFilter<TEntity>
    {
        public SimpleFilterDefinition(IReadOnlyDictionary<string, object> values) : base(values)
        {
        }
    }

    public sealed class AndFilterDefinition<TEntity> : KeyFilter<TEntity>
    {
        public AndFilterDefinition(IReadOnlyDictionary<string, object> values) : base(values)
        {
        }
    }
}
