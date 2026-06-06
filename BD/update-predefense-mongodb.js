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

// Чтобы экран сообщений не был пустым в демонстрационной базе, добавляем несколько писем,
// но только если сообщений пока нет.
if (database.getCollection("messages").countDocuments({}) === 0) {
  database.getCollection("messages").insertMany([
    {
      _id: UUID("0b49b11f-110d-5f4d-a16c-91f5c6791001"),
      InternalMessageID: UUID("0b49b11f-110d-5f4d-a16c-91f5c6791001"),
      SenderStaffID: UUID("38841fb3-3d9e-530e-87ac-405843ba1e82"),
      RecipientStaffID: UUID("4be43b93-b4cb-5c93-b1b6-434251fd7e7d"),
      Subject: "Согласование поставки",
      Body: "Поступление товара по поставщику Тривес подготовлено. Проверьте склад приемки.",
      SentAt: ISODate("2026-03-14T09:15:00"),
      IsRead: false
    },
    {
      _id: UUID("01b6a806-6877-5f89-bcb6-7b7d1a920002"),
      InternalMessageID: UUID("01b6a806-6877-5f89-bcb6-7b7d1a920002"),
      SenderStaffID: UUID("4be43b93-b4cb-5c93-b1b6-434251fd7e7d"),
      RecipientStaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
      Subject: "Проверить онлайн-заказ",
      Body: "Пожалуйста, проверьте внешний номер заказа и адрес доставки перед выставлением счета.",
      SentAt: ISODate("2026-03-14T10:35:00"),
      IsRead: true
    },
    {
      _id: UUID("e2f67f38-c447-542a-9fe2-c66c7b4e0003"),
      InternalMessageID: UUID("e2f67f38-c447-542a-9fe2-c66c7b4e0003"),
      SenderStaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
      RecipientStaffID: UUID("4be43b93-b4cb-5c93-b1b6-434251fd7e7d"),
      Subject: "Нужна корректировка остатка",
      Body: "После приемки обнаружено расхождение по количеству. Проверьте карточку товара.",
      SentAt: ISODate("2026-03-15T11:20:00"),
      IsRead: false
    },
    {
      _id: UUID("d2eb9c32-7af1-5d2c-9c24-12aa0da40004"),
      InternalMessageID: UUID("d2eb9c32-7af1-5d2c-9c24-12aa0da40004"),
      SenderStaffID: UUID("4be43b93-b4cb-5c93-b1b6-434251fd7e7d"),
      RecipientStaffID: UUID("38841fb3-3d9e-530e-87ac-405843ba1e82"),
      Subject: "Отчет по заказам",
      Body: "Сформируйте отчет за месяц после закрытия последних доставленных заказов.",
      SentAt: ISODate("2026-03-15T15:40:00"),
      IsRead: false
    }
  ]);
}

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
