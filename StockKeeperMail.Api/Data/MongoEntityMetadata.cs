using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Описывает соответствие C#-моделей коллекциям MongoDB и их скалярным полям.
    /// </summary>
    public static class MongoEntityMetadata
    {
        /// <summary>
        /// Возвращает имя коллекции MongoDB для указанной сущности.
        /// Имена коллекций совпадают с REST-маршрутами проекта.
        /// </summary>
        public static string GetCollectionName<TEntity>()
        {
            return ApiRouteMapper.GetRoute<TEntity>();
        }


        /// <summary>
        /// Возвращает дополнительные имена коллекций, которые могли использоваться в старой MongoDB-версии проекта.
        /// Это нужно, чтобы уже созданные пользователем документы не пропадали после перехода между версиями.
        /// </summary>
        public static IReadOnlyList<string> GetCollectionAliases<TEntity>()
        {
            string primary = GetCollectionName<TEntity>();
            List<string> aliases = new List<string>();

            if (typeof(TEntity) == typeof(InternalMessage))
            {
                aliases.AddRange(new[]
                {
                    "InternalMessages",
                    "internalMessages",
                    "internal-messages",
                    "internal_messages"
                });
            }

            return aliases
                .Where(name => !string.IsNullOrWhiteSpace(name) && !string.Equals(name, primary, StringComparison.OrdinalIgnoreCase))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }

        /// <summary>
        /// Возвращает публичные простые свойства, которые должны храниться в документе MongoDB.
        /// Навигационные свойства не сохраняются, чтобы не дублировать связанные сущности.
        /// </summary>
        public static IReadOnlyList<PropertyInfo> GetScalarProperties<TEntity>()
        {
            return typeof(TEntity)
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => p.CanRead && p.CanWrite && IsScalarType(p.PropertyType))
                .OrderBy(p => p.MetadataToken)
                .ToArray();
        }

        /// <summary>
        /// Возвращает ключевые свойства сущности, помеченные атрибутом [Key].
        /// </summary>
        public static IReadOnlyList<PropertyInfo> GetKeyProperties<TEntity>()
        {
            return EntityKeyFilterBuilder.GetKeyProperties(typeof(TEntity)).ToArray();
        }

        private static bool IsScalarType(Type type)
        {
            Type effectiveType = Nullable.GetUnderlyingType(type) ?? type;

            return effectiveType == typeof(string)
                || effectiveType == typeof(Guid)
                || effectiveType == typeof(int)
                || effectiveType == typeof(long)
                || effectiveType == typeof(decimal)
                || effectiveType == typeof(double)
                || effectiveType == typeof(float)
                || effectiveType == typeof(bool)
                || effectiveType == typeof(DateTime)
                || effectiveType == typeof(DateTimeOffset)
                || effectiveType.IsEnum;
        }
    }
}
