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
            MongoDocumentReference reference = await FindDocumentReferenceAsync(entity);
            return reference == null ? null : Map(reference.Document);
        }

        public async Task InsertAsync(TEntity entity)
        {
            EnsureSingleGuidKey(entity);
            await _collection.InsertOneAsync(ToDocument(entity));
        }

        public async Task ReplaceAsync(TEntity entity)
        {
            MongoDocumentReference reference = await FindDocumentReferenceAsync(entity);
            if (reference == null)
            {
                throw new KeyNotFoundException($"Документ типа {typeof(TEntity).Name} не найден для обновления. Проверь значение ключа.");
            }

            BsonDocument replacement = ToDocument(entity);
            if (reference.Id != BsonNull.Value)
            {
                replacement["_id"] = reference.Id;
            }

            ReplaceOneResult result = await reference.Collection.ReplaceOneAsync(
                reference.ExactFilter,
                replacement,
                new ReplaceOptions { IsUpsert = false });

            if (result.MatchedCount == 0)
            {
                throw new KeyNotFoundException($"Документ типа {typeof(TEntity).Name} не найден для обновления по _id.");
            }
        }

        public async Task DeleteAsync(TEntity entity)
        {
            MongoDocumentReference reference = await FindDocumentReferenceAsync(entity);
            if (reference == null)
            {
                throw new KeyNotFoundException($"Документ типа {typeof(TEntity).Name} не найден для удаления. Проверь значение ключа.");
            }

            DeleteResult result = await reference.Collection.DeleteOneAsync(reference.ExactFilter);

            if (result.DeletedCount == 0)
            {
                throw new KeyNotFoundException($"Документ типа {typeof(TEntity).Name} не найден для удаления по _id.");
            }
        }

        public async Task DeleteManyAsync(string columnName, object value)
        {
            PropertyInfo column = _columns.FirstOrDefault(c => string.Equals(c.Name, columnName, StringComparison.OrdinalIgnoreCase));
            if (column == null)
            {
                throw new InvalidOperationException($"Поле {columnName} не найдено в типе {typeof(TEntity).Name}.");
            }

            FilterDefinition<BsonDocument> filter = BuildFieldCandidatesFilter(columnName, value);
            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                DeleteResult result = await collection.DeleteManyAsync(filter);

                if (result.DeletedCount > 0)
                {
                    continue;
                }

                List<BsonDocument> documents = await collection
                    .Find(FilterDefinition<BsonDocument>.Empty)
                    .ToListAsync();

                foreach (BsonDocument document in documents)
                {
                    if (TryGetDocumentElementForField(document, columnName, out BsonElement element)
                        && ValuesEquivalent(element.Value, value, column.PropertyType))
                    {
                        FilterDefinition<BsonDocument> exactFilter = document.TryGetValue("_id", out BsonValue existingId)
                            ? Builders<BsonDocument>.Filter.Eq("_id", existingId)
                            : Builders<BsonDocument>.Filter.Eq(element.Name, element.Value);

                        await collection.DeleteOneAsync(exactFilter);
                    }
                }
            }
        }

        private static bool TryGetDocumentElementForField(BsonDocument document, string fieldName, out BsonElement element)
        {
            foreach (string candidateName in GetFieldNameCandidates(fieldName))
            {
                if (TryGetElementByName(document, candidateName, out element))
                {
                    return true;
                }
            }

            element = default;
            return false;
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

        private async Task<MongoDocumentReference> FindDocumentReferenceAsync(TEntity entity)
        {
            FilterDefinition<BsonDocument> filter = BuildFilterByKeys(entity);

            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                BsonDocument document = await collection
                    .Find(filter)
                    .FirstOrDefaultAsync();

                if (document != null)
                {
                    return CreateDocumentReference(collection, document, entity);
                }
            }

            // Fallback для старых/разных BSON GUID-форматов.
            // MongoDB может хранить UUID как subtype 4, subtype 3 или строку; прямой фильтр
            // не всегда совпадает с тем представлением, которое пришло из WPF-клиента.
            // Поэтому дополнительно сравниваем ключи уже на стороне C# и затем обновляем/удаляем
            // найденный документ по его настоящему _id.
            foreach (IMongoCollection<BsonDocument> collection in _collections)
            {
                List<BsonDocument> documents = await collection
                    .Find(FilterDefinition<BsonDocument>.Empty)
                    .ToListAsync();

                foreach (BsonDocument document in documents)
                {
                    if (DocumentMatchesKeys(document, entity))
                    {
                        return CreateDocumentReference(collection, document, entity);
                    }
                }
            }

            return null;
        }

        private MongoDocumentReference CreateDocumentReference(IMongoCollection<BsonDocument> collection, BsonDocument document, TEntity entity)
        {
            BsonValue id = document.TryGetValue("_id", out BsonValue existingId)
                ? existingId
                : BsonNull.Value;

            FilterDefinition<BsonDocument> exactFilter = BuildExactDocumentFilter(document, entity);
            return new MongoDocumentReference(collection, id, document, exactFilter);
        }

        private FilterDefinition<BsonDocument> BuildExactDocumentFilter(BsonDocument document, TEntity entity)
        {
            FilterDefinitionBuilder<BsonDocument> builder = Builders<BsonDocument>.Filter;

            if (document.TryGetValue("_id", out BsonValue existingId))
            {
                return builder.Eq("_id", existingId);
            }

            List<FilterDefinition<BsonDocument>> filters = new List<FilterDefinition<BsonDocument>>();
            foreach (PropertyInfo property in _keyColumns)
            {
                if (TryGetDocumentElementForKey(document, property, out BsonElement element))
                {
                    filters.Add(builder.Eq(element.Name, element.Value));
                }
                else
                {
                    filters.Add(BuildFieldCandidatesFilter(property.Name, property.GetValue(entity)));
                }
            }

            return filters.Count == 1 ? filters[0] : builder.And(filters);
        }

        private bool DocumentMatchesKeys(BsonDocument document, TEntity entity)
        {
            foreach (PropertyInfo property in _keyColumns)
            {
                object expectedValue = property.GetValue(entity);
                if (IsEmptyKeyValue(expectedValue))
                {
                    return false;
                }

                if (!AnyDocumentElementMatchesKey(document, property, expectedValue))
                {
                    return false;
                }
            }

            return true;
        }

        private bool AnyDocumentElementMatchesKey(BsonDocument document, PropertyInfo property, object expectedValue)
        {
            foreach (BsonElement element in GetDocumentElementsForKey(document, property))
            {
                if (ValuesEquivalent(element.Value, expectedValue, property.PropertyType))
                {
                    return true;
                }
            }

            return false;
        }

        private IEnumerable<BsonElement> GetDocumentElementsForKey(BsonDocument document, PropertyInfo property)
        {
            HashSet<string> usedNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            if (IsSingleGuidKey(property) && TryGetElementByName(document, "_id", out BsonElement idElement))
            {
                usedNames.Add(idElement.Name);
                yield return idElement;
            }

            foreach (string fieldName in GetFieldNameCandidates(property.Name))
            {
                if (TryGetElementByName(document, fieldName, out BsonElement element) && usedNames.Add(element.Name))
                {
                    yield return element;
                }
            }
        }

        private bool TryGetDocumentElementForKey(BsonDocument document, PropertyInfo property, out BsonElement element)
        {
            if (IsSingleGuidKey(property))
            {
                if (TryGetElementByName(document, "_id", out element))
                {
                    return true;
                }
            }

            foreach (string fieldName in GetFieldNameCandidates(property.Name))
            {
                if (TryGetElementByName(document, fieldName, out element))
                {
                    return true;
                }
            }

            element = default;
            return false;
        }

        private static bool TryGetElementByName(BsonDocument document, string fieldName, out BsonElement element)
        {
            if (document.TryGetElement(fieldName, out element))
            {
                return true;
            }

            foreach (BsonElement candidate in document.Elements)
            {
                if (string.Equals(candidate.Name, fieldName, StringComparison.OrdinalIgnoreCase))
                {
                    element = candidate;
                    return true;
                }
            }

            element = default;
            return false;
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
                if (IsEmptyKeyValue(value))
                {
                    throw new InvalidOperationException($"Пустой ключ {property.Name} у типа {typeof(TEntity).Name}. Нельзя обновить или удалить документ без ключа.");
                }

                List<FilterDefinition<BsonDocument>> keyFilters = new List<FilterDefinition<BsonDocument>>();

                if (IsSingleGuidKey(property))
                {
                    keyFilters.Add(BuildValueFilter("_id", value));
                }

                keyFilters.Add(BuildFieldCandidatesFilter(property.Name, value));

                filters.Add(keyFilters.Count == 1 ? keyFilters[0] : builder.Or(keyFilters));
            }

            return filters.Count == 1 ? filters[0] : builder.And(filters);
        }

        private static FilterDefinition<BsonDocument> BuildFieldCandidatesFilter(string fieldName, object value)
        {
            FilterDefinitionBuilder<BsonDocument> builder = Builders<BsonDocument>.Filter;
            List<FilterDefinition<BsonDocument>> filters = GetFieldNameCandidates(fieldName)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Select(candidate => BuildValueFilter(candidate, value))
                .ToList();

            return filters.Count == 1 ? filters[0] : builder.Or(filters);
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
                    builder.Eq(fieldName, guid.ToString("D")),
                    builder.Eq(fieldName, guid.ToString("N")));
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
                yield return char.ToUpperInvariant(idVariant[0]) + idVariant.Substring(1);
            }

            if (propertyName.EndsWith("Id", StringComparison.Ordinal))
            {
                string idVariant = propertyName.Substring(0, propertyName.Length - 2) + "ID";
                yield return idVariant;
                yield return char.ToLowerInvariant(idVariant[0]) + idVariant.Substring(1);
                yield return char.ToUpperInvariant(idVariant[0]) + idVariant.Substring(1);
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

        private BsonValue GetFirstKeyValue(TEntity entity)
        {
            object value = _keyColumns[0].GetValue(entity);
            return value == null ? BsonNull.Value : ToBsonValue(value);
        }

        private static bool IsEmptyKeyValue(object value)
        {
            if (value == null)
            {
                return true;
            }

            if (value is Guid guid)
            {
                return guid == Guid.Empty;
            }

            if (value is string text)
            {
                return string.IsNullOrWhiteSpace(text);
            }

            return false;
        }

        private static bool ValuesEquivalent(BsonValue actualValue, object expectedValue, Type expectedType)
        {
            if (actualValue == null || actualValue == BsonNull.Value)
            {
                return expectedValue == null;
            }

            Type targetType = Nullable.GetUnderlyingType(expectedType) ?? expectedType;

            if (targetType == typeof(Guid))
            {
                if (expectedValue is Guid expectedGuid && TryReadGuid(actualValue, out Guid actualGuid))
                {
                    return actualGuid == expectedGuid;
                }

                return false;
            }

            if (TryFromBsonValue(actualValue, expectedType, out object convertedValue))
            {
                if (convertedValue == null || expectedValue == null)
                {
                    return convertedValue == expectedValue;
                }

                if (targetType == typeof(decimal))
                {
                    return Convert.ToDecimal(convertedValue, CultureInfo.InvariantCulture) == Convert.ToDecimal(expectedValue, CultureInfo.InvariantCulture);
                }

                if (targetType == typeof(double) || targetType == typeof(float))
                {
                    return Math.Abs(Convert.ToDouble(convertedValue, CultureInfo.InvariantCulture) - Convert.ToDouble(expectedValue, CultureInfo.InvariantCulture)) < 0.000001;
                }

                return string.Equals(
                    Convert.ToString(convertedValue, CultureInfo.InvariantCulture),
                    Convert.ToString(expectedValue, CultureInfo.InvariantCulture),
                    StringComparison.OrdinalIgnoreCase);
            }

            return string.Equals(actualValue.ToString(), Convert.ToString(expectedValue, CultureInfo.InvariantCulture), StringComparison.OrdinalIgnoreCase);
        }

        private static bool TryReadGuid(BsonValue value, out Guid guid)
        {
            try
            {
                guid = ReadGuid(value);
                return true;
            }
            catch
            {
                guid = Guid.Empty;
                return false;
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
                    : Enum.ToObject(targetType, Convert.ToInt32(value.ToString(), CultureInfo.InvariantCulture));
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
                return value.IsInt32 ? value.AsInt32 : Convert.ToInt32(value.ToString(), CultureInfo.InvariantCulture);
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

                return Convert.ToInt64(value.ToString(), CultureInfo.InvariantCulture);
            }

            if (targetType == typeof(decimal))
            {
                if (value.IsDecimal128)
                {
                    return Decimal128.ToDecimal(value.AsDecimal128);
                }

                if (value.IsDouble)
                {
                    return Convert.ToDecimal(value.AsDouble, CultureInfo.InvariantCulture);
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
                    return Convert.ToDouble(Decimal128.ToDecimal(value.AsDecimal128), CultureInfo.InvariantCulture);
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
                        byte[] bytes = binaryData.Bytes;
                        if (bytes != null && bytes.Length == 16)
                        {
                            return new Guid(bytes);
                        }

                        return Guid.Parse(binaryData.ToString());
                    }
                }
            }

            return Guid.Parse(value.ToString());
        }

        private sealed class MongoDocumentReference
        {
            public MongoDocumentReference(IMongoCollection<BsonDocument> collection, BsonValue id, BsonDocument document, FilterDefinition<BsonDocument> exactFilter)
            {
                Collection = collection;
                Id = id;
                Document = document;
                ExactFilter = exactFilter;
            }

            public IMongoCollection<BsonDocument> Collection { get; }
            public BsonValue Id { get; }
            public BsonDocument Document { get; }
            public FilterDefinition<BsonDocument> ExactFilter { get; }
        }
    }
}
