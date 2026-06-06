// Миграция для уже существующей MongoDB-базы StockKeeperMailDb.
// Запуск:
//   mongosh "mongodb://localhost:27017/StockKeeperMailDb" update-predefense-mongodb.js
//
// Скрипт НЕ очищает данные. Он добавляет коллекцию прихода товара,
// новые поля заказов и индексы для ускорения поиска.

const dbName = "StockKeeperMailDb";
const database = db.getSiblingDB(dbName);

if (!database.getCollectionNames().includes("purchase-receipts")) {
  database.createCollection("purchase-receipts");
}

if (!database.getCollectionNames().includes("messages")) {
  database.createCollection("messages");
}

database.getCollection("orders").updateMany(
  { ExternalOrderNumber: { $exists: false } },
  { $set: { ExternalOrderNumber: "" } }
);

database.getCollection("orders").updateMany(
  { IsOnlineOrder: { $exists: false } },
  { $set: { IsOnlineOrder: false } }
);

database.getCollection("orders").updateMany(
  { DeliveryAddress: { $exists: false } },
  { $set: { DeliveryAddress: "" } }
);


// Для совместимости со старыми MongoDB-базами дублируем GUID-ключ из _id в поле модели.
// Новый API умеет читать оба варианта, но наличие поля StaffID/CustomerID/OrderID облегчает диагностику в Compass.
function copyUuidIdToField(collectionName, fieldName) {
  database.getCollection(collectionName).find({ [fieldName]: { $exists: false } }).forEach(function(doc) {
    if (doc._id) {
      const patch = {};
      patch[fieldName] = doc._id;
      database.getCollection(collectionName).updateOne({ _id: doc._id }, { $set: patch });
    }
  });
}

copyUuidIdToField("roles", "RoleID");
copyUuidIdToField("staff", "StaffID");
copyUuidIdToField("categories", "CategoryID");
copyUuidIdToField("suppliers", "SupplierID");
copyUuidIdToField("warehouses", "WarehouseID");
copyUuidIdToField("locations", "LocationID");
copyUuidIdToField("products", "ProductID");
copyUuidIdToField("customers", "CustomerID");
copyUuidIdToField("orders", "OrderID");
copyUuidIdToField("defectives", "DefectiveID");
copyUuidIdToField("logs", "LogID");
copyUuidIdToField("messages", "InternalMessageID");
copyUuidIdToField("purchase-receipts", "PurchaseReceiptID");


// Сообщения в разных промежуточных версиях могли храниться в других коллекциях.
// Переносим их в основную коллекцию messages без удаления старых данных.
["InternalMessages", "internalMessages", "internal-messages", "internal_messages"].forEach(function(aliasName) {
  if (!database.getCollectionNames().includes(aliasName)) return;

  database.getCollection(aliasName).find({}).forEach(function(doc) {
    const id = doc.InternalMessageID || doc.internalMessageID || doc.InternalMessageId || doc.internalMessageId || doc._id;
    if (!id) return;

    const normalized = Object.assign({}, doc);
    normalized._id = id;
    normalized.InternalMessageID = id;
    normalized.SenderStaffID = doc.SenderStaffID || doc.senderStaffID || doc.SenderStaffId || doc.senderStaffId;
    normalized.RecipientStaffID = doc.RecipientStaffID || doc.recipientStaffID || doc.RecipientStaffId || doc.recipientStaffId;
    normalized.Subject = doc.Subject || doc.subject || "(без темы)";
    normalized.Body = doc.Body || doc.body || "";
    normalized.SentAt = doc.SentAt || doc.sentAt || new Date();
    normalized.IsRead = doc.IsRead === undefined ? (doc.isRead === undefined ? false : doc.isRead) : doc.IsRead;

    database.getCollection("messages").updateOne(
      { _id: normalized._id },
      { $setOnInsert: normalized },
      { upsert: true }
    );
  });
});

// Нормализация имен полей сообщений: API читает разные варианты, но для Compass и индексов
// удобнее иметь стандартные PascalCase-поля.
database.getCollection("messages").find({}).forEach(function(doc) {
  const patch = {};
  if (!doc.InternalMessageID && (doc.internalMessageID || doc.InternalMessageId || doc.internalMessageId || doc._id)) {
    patch.InternalMessageID = doc.internalMessageID || doc.InternalMessageId || doc.internalMessageId || doc._id;
  }
  if (!doc.SenderStaffID && (doc.senderStaffID || doc.SenderStaffId || doc.senderStaffId)) {
    patch.SenderStaffID = doc.senderStaffID || doc.SenderStaffId || doc.senderStaffId;
  }
  if (!doc.RecipientStaffID && (doc.recipientStaffID || doc.RecipientStaffId || doc.recipientStaffId)) {
    patch.RecipientStaffID = doc.recipientStaffID || doc.RecipientStaffId || doc.recipientStaffId;
  }
  if (!doc.Subject && doc.subject) patch.Subject = doc.subject;
  if (!doc.Body && doc.body) patch.Body = doc.body;
  if (!doc.SentAt && doc.sentAt) patch.SentAt = doc.sentAt;
  if (doc.IsRead === undefined && doc.isRead !== undefined) patch.IsRead = doc.isRead;

  if (Object.keys(patch).length > 0) {
    database.getCollection("messages").updateOne({ _id: doc._id }, { $set: patch });
  }
});

// Миграция не добавляет демонстрационные данные: все записи должны храниться только в MongoDB
// и создаваться пользователем через приложение или явный seed-скрипт.

database.getCollection("purchase-receipts").createIndex({ SupplierID: 1 });
database.getCollection("purchase-receipts").createIndex({ ProductID: 1 });
database.getCollection("purchase-receipts").createIndex({ WarehouseID: 1 });
database.getCollection("purchase-receipts").createIndex({ PurchasedAt: -1 });
database.getCollection("orders").createIndex({ ExternalOrderNumber: 1 });
database.getCollection("orders").createIndex({ OrderDate: -1 });
database.getCollection("messages").createIndex({ RecipientStaffID: 1, SentAt: -1 });
database.getCollection("messages").createIndex({ SenderStaffID: 1, SentAt: -1 });
database.getCollection("logs").createIndex({ DateTime: -1 });

print("Готово: MongoDB-база обновлена без удаления данных.");
