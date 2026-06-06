const dbName = db.getName();

print("Проверка MongoDB...");
print("База данных: " + dbName);

const result = db.adminCommand({ ping: 1 });
if (result.ok !== 1) {
  throw new Error("MongoDB не отвечает на ping");
}

print("MongoDB доступна.");
print("Коллекции:");
printjson(db.getCollectionNames());
