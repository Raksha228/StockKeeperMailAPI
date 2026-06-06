using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace StockKeeperMail.Api.Data
{
    /// <summary>
    /// Базовый репозиторий MongoDB для выполнения CRUD-операций.
    /// Хранит только скалярные свойства моделей; связанные сущности заполняются сервисом гидратации.
    /// </summary>
    public class MongoRepository<TEntity> where TEntity : class
    {
        private readonly IMongoCollection<BsonDocument> _collection;
        private readonly IReadOnlyList<IMongoCollection<BsonDocument>> _collections;
        private readonly IReadOnlyList<PropertyInfo> _columns;
        private readonly IReadOnlyList<PropertyInfo> _keyColumns;

        public MongoRepository(MongoDatabaseProvider databaseProvider)
        {
            _collection = databaseProvider.Database.GetCollection<BsonDocument>(MongoEntityMetadata.GetCollectionName<TEntity>());
            _collections = new[] { MongoEntityMetadata.GetCollectionName<TEntity>() }
                .Concat(MongoEntityMetadata.GetCollectionAliases<TEntity>())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Select(name => databaseProvider.Database.GetCollection<BsonDocument>(name))
                .ToArray();
            _columns = MongoEntityMetadata.GetScalarProperties<TEntity>();
            _keyColumns = MongoEntityMetadata.GetKeyProperties<TEntity>();

            if (_keyColumns.Count == 0)
            {
                throw new InvalidOperationException($"Тип {typeof(TEntity).Name} не содержит свойств с атрибутом [Key].");
            }
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            List<TEntity> result = new List<TEntity>();

            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                List<BsonDocument> documents = await collection
                    .Find(FilterDefinition<BsonDocument>.Empty)
                    .ToListAsync();

                result.AddRange(documents.Select(Map));
            }

            return result
                .GroupBy(BuildEntityKey)
                .Select(group => group.First())
                .ToList();
        }

        public async Task<TEntity> GetFirstOrDefaultByKeyAsync(TEntity entity)
        {
            FilterDefinition<BsonDocument> filter = BuildFilterByKeys(entity);

            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                BsonDocument document = await collection
                    .Find(filter)
                    .FirstOrDefaultAsync();

                if (document != null)
                {
                    return Map(document);
                }
            }

            return null;
        }

        public async Task InsertAsync(TEntity entity)
        {
            EnsureSingleGuidKey(entity);
            await _collection.InsertOneAsync(ToDocument(entity));
        }

        public async Task ReplaceAsync(TEntity entity)
        {
            FilterDefinition<BsonDocument> filter = BuildFilterByKeys(entity);
            BsonDocument replacement = ToDocument(entity);

            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                BsonDocument existing = await collection
                    .Find(filter)
                    .Project(Builders<BsonDocument>.Projection.Include("_id"))
                    .FirstOrDefaultAsync();

                if (existing != null)
                {
                    if (existing.TryGetValue("_id", out BsonValue existingId))
                    {
                        replacement["_id"] = existingId;
                    }

                    await collection.ReplaceOneAsync(filter, replacement, new ReplaceOptions { IsUpsert = false });
                    return;
                }
            }

            await _collection.ReplaceOneAsync(filter, replacement, new ReplaceOptions { IsUpsert = true });
        }

        public async Task DeleteAsync(TEntity entity)
        {
            FilterDefinition<BsonDocument> filter = BuildFilterByKeys(entity);
            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                await collection.DeleteOneAsync(filter);
            }
        }

        public async Task DeleteManyAsync(string columnName, object value)
        {
            if (!_columns.Any(column => column.Name == columnName))
            {
                throw new InvalidOperationException($"Поле {columnName} не найдено в типе {typeof(TEntity).Name}.");
            }

            FilterDefinition<BsonDocument> filter = BuildValueFilter(columnName, value);
            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                await collection.DeleteManyAsync(filter);
            }
        }

        public async Task InsertManyAsync(IEnumerable<TEntity> entities)
        {
            List<BsonDocument> documents = new List<BsonDocument>();
            foreach (TEntity entity in entities)
            {
                EnsureSingleGuidKey(entity);
                documents.Add(ToDocument(entity));
            }

            if (documents.Count > 0)
            {
                await _collection.InsertManyAsync(documents);
            }
        }

        public async Task ReplaceManyAsync(IEnumerable<TEntity> entities)
        {
            foreach (TEntity entity in entities)
            {
                await ReplaceAsync(entity);
            }
        }

        private FilterDefinition<BsonDocument> BuildFilterByKeys(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            FilterDefinitionBuilder<BsonDocument> builder = Builders<BsonDocument>.Filter;
            List<FilterDefinition<BsonDocument>> filters = new List<FilterDefinition<BsonDocument>>();

            foreach (PropertyInfo property in _keyColumns)
            {
                object value = property.GetValue(entity);
                if (IsSingleGuidKey(property))
                {
                    filters.Add(builder.Or(
                        BuildValueFilter("_id", value),
                        BuildValueFilter(property.Name, value)));
                }
                else
                {
                    filters.Add(BuildValueFilter(property.Name, value));
                }
            }

            return filters.Count == 1 ? filters[0] : builder.And(filters);
        }

        private static FilterDefinition<BsonDocument> BuildValueFilter(string fieldName, object value)
        {
            FilterDefinitionBuilder<BsonDocument> builder = Builders<BsonDocument>.Filter;

            if (value is Guid guid)
            {
                return builder.Or(
                    builder.Eq(fieldName, new BsonBinaryData(guid, GuidRepresentation.Standard)),
                    builder.Eq(fieldName, new BsonBinaryData(guid, GuidRepresentation.CSharpLegacy)),
                    builder.Eq(fieldName, guid.ToString()),
                    builder.Eq(fieldName, guid.ToString("D")));
            }

            return builder.Eq(fieldName, ToBsonValue(value));
        }

        private BsonDocument ToDocument(TEntity entity)
        {
            BsonDocument document = new BsonDocument();

            foreach (PropertyInfo property in _columns)
            {
                object value = property.GetValue(entity);
                BsonValue bsonValue = value == null ? BsonNull.Value : ToBsonValue(value);

                if (IsSingleGuidKey(property))
                {
                    // Основной идентификатор MongoDB. Дополнительно сохраняем поле с исходным именем
                    // (например StaffID/CustomerID), чтобы проект корректно работал и со старыми базами,
                    // где ключ мог храниться не только в _id.
                    document["_id"] = bsonValue;
                    document[property.Name] = bsonValue;
                }
                else
                {
                    document[property.Name] = bsonValue;
                }
            }

            return document;
        }

        private TEntity Map(BsonDocument document)
        {
            TEntity entity = (TEntity)Activator.CreateInstance(typeof(TEntity));

            foreach (PropertyInfo property in _columns)
            {
                if (!TryGetDocumentValue(document, property, out BsonValue value) || value == BsonNull.Value)
                {
                    continue;
                }

                if (!TryFromBsonValue(value, property.PropertyType, out object convertedValue))
                {
                    continue;
                }

                if (convertedValue != null || !property.PropertyType.IsValueType || Nullable.GetUnderlyingType(property.PropertyType) != null)
                {
                    property.SetValue(entity, convertedValue);
                }
            }

            return entity;
        }

        private bool TryGetDocumentValue(BsonDocument document, PropertyInfo property, out BsonValue value)
        {
            if (IsSingleGuidKey(property))
            {
                if (TryGetValueByName(document, "_id", property.PropertyType, out value))
                {
                    return true;
                }
            }

            foreach (string fieldName in GetFieldNameCandidates(property.Name))
            {
                if (TryGetValueByName(document, fieldName, property.PropertyType, out value))
                {
                    return true;
                }
            }

            value = BsonNull.Value;
            return false;
        }

        private static bool TryGetValueByName(BsonDocument document, string fieldName, Type propertyType, out BsonValue value)
        {
            if (document.TryGetValue(fieldName, out value) && CanConvertBsonValue(value, propertyType))
            {
                return true;
            }

            BsonElement element = document.Elements.FirstOrDefault(e => string.Equals(e.Name, fieldName, StringComparison.OrdinalIgnoreCase));
            if (element.Name != null && CanConvertBsonValue(element.Value, propertyType))
            {
                value = element.Value;
                return true;
            }

            value = BsonNull.Value;
            return false;
        }

        private static IEnumerable<string> GetFieldNameCandidates(string propertyName)
        {
            yield return propertyName;

            if (!string.IsNullOrWhiteSpace(propertyName))
            {
                yield return char.ToLowerInvariant(propertyName[0]) + propertyName.Substring(1);
                yield return char.ToUpperInvariant(propertyName[0]) + propertyName.Substring(1);
            }

            if (propertyName.EndsWith("ID", StringComparison.Ordinal))
            {
                string idVariant = propertyName.Substring(0, propertyName.Length - 2) + "Id";
                yield return idVariant;
                yield return char.ToLowerInvariant(idVariant[0]) + idVariant.Substring(1);
            }
        }


        private string BuildEntityKey(TEntity entity)
        {
            return string.Join("|", _keyColumns.Select(property => Convert.ToString(property.GetValue(entity), CultureInfo.InvariantCulture)));
        }

        private bool IsSingleGuidKey(PropertyInfo property)
        {
            return _keyColumns.Count == 1 && _keyColumns[0].Name == property.Name && property.PropertyType == typeof(Guid);
        }

        private void EnsureSingleGuidKey(TEntity entity)
        {
            if (_keyColumns.Count != 1 || _keyColumns[0].PropertyType != typeof(Guid))
            {
                return;
            }

            PropertyInfo key = _keyColumns[0];
            Guid value = (Guid)key.GetValue(entity);
            if (value == Guid.Empty)
            {
                key.SetValue(entity, Guid.NewGuid());
            }
        }

        private static BsonValue ToBsonValue(object value)
        {
            if (value == null)
            {
                return BsonNull.Value;
            }

            Type valueType = Nullable.GetUnderlyingType(value.GetType()) ?? value.GetType();

            if (valueType.IsEnum)
            {
                return value.ToString();
            }

            if (valueType == typeof(Guid))
            {
                return new BsonBinaryData((Guid)value, GuidRepresentation.Standard);
            }

            if (valueType == typeof(decimal))
            {
                return new BsonDecimal128(Decimal128.Parse(((decimal)value).ToString(CultureInfo.InvariantCulture)));
            }

            if (valueType == typeof(DateTime))
            {
                return new BsonDateTime((DateTime)value);
            }

            if (valueType == typeof(DateTimeOffset))
            {
                return new BsonDateTime(((DateTimeOffset)value).UtcDateTime);
            }

            return BsonValue.Create(value);
        }

        private static bool CanConvertBsonValue(BsonValue value, Type propertyType)
        {
            return TryFromBsonValue(value, propertyType, out _);
        }

        private static bool TryFromBsonValue(BsonValue value, Type propertyType, out object convertedValue)
        {
            try
            {
                convertedValue = FromBsonValue(value, propertyType);
                return true;
            }
            catch
            {
                convertedValue = null;
                return false;
            }
        }

        private static object FromBsonValue(BsonValue value, Type propertyType)
        {
            Type targetType = Nullable.GetUnderlyingType(propertyType) ?? propertyType;

            if (targetType.IsEnum)
            {
                return value.IsString
                    ? Enum.Parse(targetType, value.AsString)
                    : Enum.ToObject(targetType, Convert.ToInt32(value));
            }

            if (targetType == typeof(Guid))
            {
                return ReadGuid(value);
            }

            if (targetType == typeof(string))
            {
                return value.IsString ? value.AsString : value.ToString();
            }

            if (targetType == typeof(int))
            {
                return value.IsInt32 ? value.AsInt32 : int.Parse(value.ToString(), CultureInfo.InvariantCulture);
            }

            if (targetType == typeof(long))
            {
                if (value.IsInt64)
                {
                    return value.AsInt64;
                }

                if (value.IsInt32)
                {
                    return Convert.ToInt64(value.AsInt32, CultureInfo.InvariantCulture);
                }

                return long.Parse(value.ToString(), CultureInfo.InvariantCulture);
            }

            if (targetType == typeof(decimal))
            {
                if (value.IsDecimal128)
                {
                    return Decimal128.ToDecimal(value.AsDecimal128);
                }

                if (value.IsDouble)
                {
                    return Convert.ToDecimal(value.AsDouble);
                }

                if (value.IsInt32)
                {
                    return Convert.ToDecimal(value.AsInt32, CultureInfo.InvariantCulture);
                }

                if (value.IsInt64)
                {
                    return Convert.ToDecimal(value.AsInt64, CultureInfo.InvariantCulture);
                }

                return decimal.Parse(value.ToString(), CultureInfo.InvariantCulture);
            }

            if (targetType == typeof(double))
            {
                if (value.IsDouble)
                {
                    return value.AsDouble;
                }

                if (value.IsDecimal128)
                {
                    return Convert.ToDouble(Decimal128.ToDecimal(value.AsDecimal128));
                }

                return double.Parse(value.ToString(), CultureInfo.InvariantCulture);
            }

            if (targetType == typeof(float))
            {
                return Convert.ToSingle(FromBsonValue(value, typeof(double)), CultureInfo.InvariantCulture);
            }

            if (targetType == typeof(bool))
            {
                return value.IsBoolean ? value.AsBoolean : bool.Parse(value.ToString());
            }

            if (targetType == typeof(DateTime))
            {
                return DateTime.SpecifyKind(value.ToUniversalTime(), DateTimeKind.Unspecified);
            }

            if (targetType == typeof(DateTimeOffset))
            {
                return new DateTimeOffset(value.ToUniversalTime());
            }

            return Convert.ChangeType(value.ToString(), targetType, CultureInfo.InvariantCulture);
        }

        private static Guid ReadGuid(BsonValue value)
        {
            if (value.IsString)
            {
                return Guid.Parse(value.AsString);
            }

            if (value.IsBsonBinaryData)
            {
                BsonBinaryData binaryData = value.AsBsonBinaryData;
                try
                {
                    return binaryData.ToGuid(GuidRepresentation.Standard);
                }
                catch
                {
                    try
                    {
                        return binaryData.ToGuid(GuidRepresentation.CSharpLegacy);
                    }
                    catch
                    {
                        return Guid.Parse(binaryData.ToString());
                    }
                }
            }

            return Guid.Parse(value.ToString());
        }
    }
}
