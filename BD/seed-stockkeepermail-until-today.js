// Seed для StockKeeperMail / MongoDB / mongosh
// Расширенная демонстрационная база до сегодняшнего дня.
// Период данных: 01.02.2026 — 06.06.2026.
// Заказы распределены по месяцам неравномерно:
// февраль — 18, март — 37, апрель — 24, май — 46, июнь до 06.06.2026 — 15.
//
// Запуск:
//   mongosh "mongodb://localhost:27017/StockKeeperMailDb" seed-stockkeepermail-until-today.js
//
// Скрипт полностью очищает основные коллекции и заново заполняет данные.
// Включены новые поля заказов и прихода товара:
// - orders.ExternalOrderNumber
// - orders.IsOnlineOrder
// - orders.DeliveryAddress
// - purchase-receipts.DocumentNumber
// - purchase-receipts.Quantity
// - purchase-receipts.UnitPrice
// - purchase-receipts.TotalAmount
// - purchase-receipts.PurchasedAt
// - purchase-receipts.Comment

const dbName = "StockKeeperMailDb";
const database = db.getSiblingDB(dbName);

const collectionsToReset = [
  "roles",
  "staff",
  "categories",
  "suppliers",
  "warehouses",
  "locations",
  "products",
  "product-locations",
  "purchase-receipts",
  "customers",
  "orders",
  "order-details",
  "defectives",
  "logs",
  "messages"
];

collectionsToReset.forEach(function(name) {
  database.getCollection(name).deleteMany({});
});

if (!database.getCollectionNames().includes("purchase-receipts")) {
  database.createCollection("purchase-receipts");
}
if (!database.getCollectionNames().includes("messages")) {
  database.createCollection("messages");
}

const roles = [
{
  _id: UUID("d0b72c30-3bdc-4c25-b0af-334f73e30f20"),
  RoleID: UUID("d0b72c30-3bdc-4c25-b0af-334f73e30f20"),
  RoleName: "Админ",
  RoleStatus: "Active",
  RoleDescription: "Полный доступ ко всем разделам системы",
  OrdersView: true,
  OrdersAdd: true,
  OrdersEdit: true,
  OrdersDelete: true,
  CustomersView: true,
  CustomersAdd: true,
  CustomersEdit: true,
  CustomersDelete: true,
  ProductsView: true,
  ProductsAdd: true,
  ProductsEdit: true,
  ProductsDelete: true,
  StoragesView: true,
  StoragesAdd: true,
  StoragesEdit: true,
  StoragesDelete: true,
  DefectivesView: true,
  DefectivesAdd: true,
  DefectivesEdit: true,
  DefectivesDelete: true,
  CategoriesView: true,
  CategoriesAdd: true,
  CategoriesEdit: true,
  CategoriesDelete: true,
  LocationsView: true,
  LocationsAdd: true,
  LocationsEdit: true,
  LocationsDelete: true,
  SuppliersView: true,
  SuppliersAdd: true,
  SuppliersEdit: true,
  SuppliersDelete: true,
  RolesView: true,
  RolesAdd: true,
  RolesEdit: true,
  RolesDelete: true,
  StaffsView: true,
  StaffsAdd: true,
  StaffsEdit: true,
  StaffsDelete: true,
  LogsView: true,
  LogsAdd: true,
  LogsEdit: true,
  LogsDelete: true
},
{
  _id: UUID("9a528f97-129a-4de7-b1e2-b4e521db48e3"),
  RoleID: UUID("9a528f97-129a-4de7-b1e2-b4e521db48e3"),
  RoleName: "Управляющий магазином",
  RoleStatus: "Active",
  RoleDescription: "Контроль заказов, прихода товара, складов и персонала",
  OrdersView: true,
  OrdersAdd: true,
  OrdersEdit: true,
  OrdersDelete: true,
  CustomersView: true,
  CustomersAdd: true,
  CustomersEdit: true,
  CustomersDelete: true,
  ProductsView: true,
  ProductsAdd: true,
  ProductsEdit: true,
  ProductsDelete: true,
  StoragesView: true,
  StoragesAdd: true,
  StoragesEdit: true,
  StoragesDelete: true,
  DefectivesView: true,
  DefectivesAdd: true,
  DefectivesEdit: true,
  DefectivesDelete: true,
  CategoriesView: true,
  CategoriesAdd: true,
  CategoriesEdit: true,
  CategoriesDelete: true,
  LocationsView: true,
  LocationsAdd: true,
  LocationsEdit: true,
  LocationsDelete: true,
  SuppliersView: true,
  SuppliersAdd: true,
  SuppliersEdit: true,
  SuppliersDelete: true,
  RolesView: true,
  RolesAdd: true,
  RolesEdit: true,
  RolesDelete: false,
  StaffsView: true,
  StaffsAdd: true,
  StaffsEdit: true,
  StaffsDelete: false,
  LogsView: true,
  LogsAdd: true,
  LogsEdit: true,
  LogsDelete: false
},
{
  _id: UUID("86d40b3e-41df-49b4-b356-72768d3e8c22"),
  RoleID: UUID("86d40b3e-41df-49b4-b356-72768d3e8c22"),
  RoleName: "Продавец-консультант",
  RoleStatus: "Active",
  RoleDescription: "Работа с клиентами, заказами и просмотром остатков",
  OrdersView: true,
  OrdersAdd: true,
  OrdersEdit: true,
  OrdersDelete: false,
  CustomersView: true,
  CustomersAdd: true,
  CustomersEdit: true,
  CustomersDelete: false,
  ProductsView: true,
  ProductsAdd: false,
  ProductsEdit: false,
  ProductsDelete: false,
  StoragesView: true,
  StoragesAdd: false,
  StoragesEdit: false,
  StoragesDelete: false,
  DefectivesView: false,
  DefectivesAdd: false,
  DefectivesEdit: false,
  DefectivesDelete: false,
  CategoriesView: true,
  CategoriesAdd: false,
  CategoriesEdit: false,
  CategoriesDelete: false,
  LocationsView: true,
  LocationsAdd: false,
  LocationsEdit: false,
  LocationsDelete: false,
  SuppliersView: true,
  SuppliersAdd: false,
  SuppliersEdit: false,
  SuppliersDelete: false,
  RolesView: false,
  RolesAdd: false,
  RolesEdit: false,
  RolesDelete: false,
  StaffsView: false,
  StaffsAdd: false,
  StaffsEdit: false,
  StaffsDelete: false,
  LogsView: false,
  LogsAdd: false,
  LogsEdit: false,
  LogsDelete: false
},
{
  _id: UUID("24c6fa10-a311-422d-8b90-3d28c644e088"),
  RoleID: UUID("24c6fa10-a311-422d-8b90-3d28c644e088"),
  RoleName: "Кладовщик",
  RoleStatus: "Active",
  RoleDescription: "Приемка товара, складские остатки и перемещения",
  OrdersView: false,
  OrdersAdd: false,
  OrdersEdit: false,
  OrdersDelete: false,
  CustomersView: false,
  CustomersAdd: false,
  CustomersEdit: false,
  CustomersDelete: false,
  ProductsView: true,
  ProductsAdd: false,
  ProductsEdit: false,
  ProductsDelete: false,
  StoragesView: true,
  StoragesAdd: true,
  StoragesEdit: true,
  StoragesDelete: true,
  DefectivesView: true,
  DefectivesAdd: true,
  DefectivesEdit: true,
  DefectivesDelete: true,
  CategoriesView: false,
  CategoriesAdd: false,
  CategoriesEdit: false,
  CategoriesDelete: false,
  LocationsView: true,
  LocationsAdd: false,
  LocationsEdit: false,
  LocationsDelete: false,
  SuppliersView: true,
  SuppliersAdd: false,
  SuppliersEdit: false,
  SuppliersDelete: false,
  RolesView: false,
  RolesAdd: false,
  RolesEdit: false,
  RolesDelete: false,
  StaffsView: false,
  StaffsAdd: false,
  StaffsEdit: false,
  StaffsDelete: false,
  LogsView: false,
  LogsAdd: false,
  LogsEdit: false,
  LogsDelete: false
}
];
database.getCollection("roles").insertMany(roles);

const staff = [
{
  _id: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  StaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  RoleID: UUID("d0b72c30-3bdc-4c25-b0af-334f73e30f20"),
  StaffFirstName: "Алексей",
  StaffLastName: "Кузнецов",
  StaffAddress: "г. Волгодонск, пр-т Строителей, 21",
  StaffPhone: "+7-928-610-10-01",
  StaffEmail: "admin@volgomed.local",
  StaffUsername: "admin",
  StaffPassword: "admin123"
},
{
  _id: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  RoleID: UUID("9a528f97-129a-4de7-b1e2-b4e521db48e3"),
  StaffFirstName: "Марина",
  StaffLastName: "Егорова",
  StaffAddress: "г. Волгодонск, б-р Великой Победы, 38",
  StaffPhone: "+7-928-610-10-02",
  StaffEmail: "manager@volgomed.local",
  StaffUsername: "manager",
  StaffPassword: "manager123"
},
{
  _id: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  RoleID: UUID("86d40b3e-41df-49b4-b356-72768d3e8c22"),
  StaffFirstName: "Ирина",
  StaffLastName: "Соколова",
  StaffAddress: "г. Волгодонск, ул. Ленина, 74",
  StaffPhone: "+7-928-610-10-03",
  StaffEmail: "seller1@volgomed.local",
  StaffUsername: "seller1",
  StaffPassword: "seller123"
},
{
  _id: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  RoleID: UUID("86d40b3e-41df-49b4-b356-72768d3e8c22"),
  StaffFirstName: "Павел",
  StaffLastName: "Логинов",
  StaffAddress: "г. Волгодонск, ул. Морская, 19",
  StaffPhone: "+7-928-610-10-04",
  StaffEmail: "seller2@volgomed.local",
  StaffUsername: "seller2",
  StaffPassword: "seller123"
},
{
  _id: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  RoleID: UUID("86d40b3e-41df-49b4-b356-72768d3e8c22"),
  StaffFirstName: "Елена",
  StaffLastName: "Громова",
  StaffAddress: "г. Волгодонск, ул. Энтузиастов, 42",
  StaffPhone: "+7-928-610-10-05",
  StaffEmail: "seller3@volgomed.local",
  StaffUsername: "seller3",
  StaffPassword: "seller123"
},
{
  _id: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  RoleID: UUID("24c6fa10-a311-422d-8b90-3d28c644e088"),
  StaffFirstName: "Николай",
  StaffLastName: "Федоров",
  StaffAddress: "г. Волгодонск, ул. Весенняя, 11",
  StaffPhone: "+7-928-610-10-06",
  StaffEmail: "warehouse@volgomed.local",
  StaffUsername: "warehouse",
  StaffPassword: "stock123"
}
];
database.getCollection("staff").insertMany(staff);

const categories = [
{
  _id: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  CategoryID: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  CategoryName: "Ортопедические изделия",
  CategoryStatus: "Active",
  CategoryDescription: "Стельки, бандажи, корсеты и поддерживающие изделия"
},
{
  _id: UUID("fa84dd9b-5766-43d4-8175-43f0ba0f5a44"),
  CategoryID: UUID("fa84dd9b-5766-43d4-8175-43f0ba0f5a44"),
  CategoryName: "Компрессионный трикотаж",
  CategoryStatus: "Active",
  CategoryDescription: "Гольфы, чулки и колготки различного класса компрессии"
},
{
  _id: UUID("52f3b86b-6a40-4cff-9db6-f9803307f20e"),
  CategoryID: UUID("52f3b86b-6a40-4cff-9db6-f9803307f20e"),
  CategoryName: "Средства реабилитации",
  CategoryStatus: "Active",
  CategoryDescription: "Трости, ходунки, фиксаторы и товары для восстановления"
},
{
  _id: UUID("cc2ed40d-e8a1-4a5d-b783-76052890658b"),
  CategoryID: UUID("cc2ed40d-e8a1-4a5d-b783-76052890658b"),
  CategoryName: "Урологические изделия",
  CategoryStatus: "Active",
  CategoryDescription: "Катетеры, мочеприемники и сопутствующая продукция"
},
{
  _id: UUID("f7fb8b6d-7337-47ff-be8d-e66cd6515719"),
  CategoryID: UUID("f7fb8b6d-7337-47ff-be8d-e66cd6515719"),
  CategoryName: "Медицинские расходные материалы",
  CategoryStatus: "Active",
  CategoryDescription: "Пеленки, перчатки, средства ухода и расходные позиции"
}
];
database.getCollection("categories").insertMany(categories);

const suppliers = [
{
  _id: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  SupplierName: "ООО «Крейт Медикал»",
  SupplierAddress: "195220, г. Санкт-Петербург, ул. Бутлерова, д. 11",
  SupplierPhone: "+7 (800) 700-68-50",
  SupplierEmail: "orders@kreit-med.local",
  SupplierStatus: "Active"
},
{
  _id: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  SupplierName: "ООО «Тривес Ортопедия»",
  SupplierAddress: "196624, г. Санкт-Петербург, Московское шоссе, д. 25",
  SupplierPhone: "+7 (812) 329-72-97",
  SupplierEmail: "sale@trives-ortho.local",
  SupplierStatus: "Active"
},
{
  _id: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  SupplierName: "ООО «Экотен»",
  SupplierAddress: "197110, г. Санкт-Петербург, Константиновский пр., д. 18А",
  SupplierPhone: "+7 (812) 325-09-04",
  SupplierEmail: "order@ecoten.local",
  SupplierStatus: "Active"
},
{
  _id: UUID("f5e17990-2ce6-4b75-aee7-51afd0832baf"),
  SupplierID: UUID("f5e17990-2ce6-4b75-aee7-51afd0832baf"),
  SupplierName: "ООО «Малтри Мед»",
  SupplierAddress: "127018, г. Москва, ул. Складочная, д. 3",
  SupplierPhone: "+7 (495) 120-45-16",
  SupplierEmail: "client@maltri-med.local",
  SupplierStatus: "Active"
},
{
  _id: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  SupplierName: "ООО «МедСклад Дон»",
  SupplierAddress: "344000, г. Ростов-на-Дону, ул. Доватора, д. 148",
  SupplierPhone: "+7 (863) 210-44-51",
  SupplierEmail: "zakaz@medsklad-don.local",
  SupplierStatus: "Active"
}
];
database.getCollection("suppliers").insertMany(suppliers);

const warehouses = [
{
  _id: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  WarehouseName: "Магазин «ВолгоМед» — Центральный зал",
  WarehouseAddress: "г. Волгодонск, б-р Великой Победы, 38, торговый зал",
  WarehouseStatus: "Active"
},
{
  _id: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  WarehouseName: "Магазин «ВолгоМед» — Ортопедический салон",
  WarehouseAddress: "г. Волгодонск, ул. Ленина, 92, салон ортопедии",
  WarehouseStatus: "Active"
},
{
  _id: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  WarehouseName: "Склад «ВолгоМед» — Приемка и резерв",
  WarehouseAddress: "г. Волгодонск, ул. Энтузиастов, 18, складской блок",
  WarehouseStatus: "Active"
},
{
  _id: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  WarehouseName: "Склад «ВолгоМед» — Интернет-заказы",
  WarehouseAddress: "г. Волгодонск, ул. Морская, 34, зона комплектации",
  WarehouseStatus: "Active"
}
];
database.getCollection("warehouses").insertMany(warehouses);

const locations = [
{
  _id: UUID("4a452ebb-e215-4e7d-9c23-dea13d2cd2f9"),
  LocationID: UUID("4a452ebb-e215-4e7d-9c23-dea13d2cd2f9"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  LocationName: "Стеллаж А1",
  LocationDescription: "Основная выкладка ходовых товаров; Магазин «ВолгоМед» — Центральный зал",
  LocationStatus: "Active"
},
{
  _id: UUID("63d56755-0540-4725-a711-5cbbf0ab01c1"),
  LocationID: UUID("63d56755-0540-4725-a711-5cbbf0ab01c1"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  LocationName: "Стеллаж А2",
  LocationDescription: "Резервные упаковки и коробочный запас; Магазин «ВолгоМед» — Центральный зал",
  LocationStatus: "Active"
},
{
  _id: UUID("2df6083e-8cb8-49d2-8690-101705c2456a"),
  LocationID: UUID("2df6083e-8cb8-49d2-8690-101705c2456a"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  LocationName: "Витрина B1",
  LocationDescription: "Товары для демонстрации клиентам; Магазин «ВолгоМед» — Центральный зал",
  LocationStatus: "Active"
},
{
  _id: UUID("1866e08d-ead4-416c-9c1f-c9d258e3ecfc"),
  LocationID: UUID("1866e08d-ead4-416c-9c1f-c9d258e3ecfc"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  LocationName: "Ячейка C1",
  LocationDescription: "Комплектация онлайн-заказов; Магазин «ВолгоМед» — Центральный зал",
  LocationStatus: "Active"
},
{
  _id: UUID("a2e45509-0cd0-4af8-a5d5-94efb14da462"),
  LocationID: UUID("a2e45509-0cd0-4af8-a5d5-94efb14da462"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  LocationName: "Зона приемки D1",
  LocationDescription: "Временное хранение после прихода; Магазин «ВолгоМед» — Центральный зал",
  LocationStatus: "Active"
},
{
  _id: UUID("efc3d207-ddbc-45ef-8638-0c1da247925d"),
  LocationID: UUID("efc3d207-ddbc-45ef-8638-0c1da247925d"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  LocationName: "Стеллаж А1",
  LocationDescription: "Основная выкладка ходовых товаров; Магазин «ВолгоМед» — Ортопедический салон",
  LocationStatus: "Active"
},
{
  _id: UUID("c31a37be-7ac6-4329-bc3c-3eec293c2778"),
  LocationID: UUID("c31a37be-7ac6-4329-bc3c-3eec293c2778"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  LocationName: "Стеллаж А2",
  LocationDescription: "Резервные упаковки и коробочный запас; Магазин «ВолгоМед» — Ортопедический салон",
  LocationStatus: "Active"
},
{
  _id: UUID("7d3c2ac7-1dc5-4fa4-8ab5-3335b02a4af5"),
  LocationID: UUID("7d3c2ac7-1dc5-4fa4-8ab5-3335b02a4af5"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  LocationName: "Витрина B1",
  LocationDescription: "Товары для демонстрации клиентам; Магазин «ВолгоМед» — Ортопедический салон",
  LocationStatus: "Active"
},
{
  _id: UUID("5b9c5965-85e6-4572-9128-def204639d6f"),
  LocationID: UUID("5b9c5965-85e6-4572-9128-def204639d6f"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  LocationName: "Ячейка C1",
  LocationDescription: "Комплектация онлайн-заказов; Магазин «ВолгоМед» — Ортопедический салон",
  LocationStatus: "Active"
},
{
  _id: UUID("73a6e4d8-d126-4a0c-9710-525dd742f98a"),
  LocationID: UUID("73a6e4d8-d126-4a0c-9710-525dd742f98a"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  LocationName: "Зона приемки D1",
  LocationDescription: "Временное хранение после прихода; Магазин «ВолгоМед» — Ортопедический салон",
  LocationStatus: "Active"
},
{
  _id: UUID("6d6356b3-dd96-46b6-b055-ede5316dbba4"),
  LocationID: UUID("6d6356b3-dd96-46b6-b055-ede5316dbba4"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  LocationName: "Стеллаж А1",
  LocationDescription: "Основная выкладка ходовых товаров; Склад «ВолгоМед» — Приемка и резерв",
  LocationStatus: "Active"
},
{
  _id: UUID("70dfddad-b6d1-4d49-94cf-24de6313fee0"),
  LocationID: UUID("70dfddad-b6d1-4d49-94cf-24de6313fee0"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  LocationName: "Стеллаж А2",
  LocationDescription: "Резервные упаковки и коробочный запас; Склад «ВолгоМед» — Приемка и резерв",
  LocationStatus: "Active"
},
{
  _id: UUID("550f71c0-3c3c-4c13-b6d5-e5992b14618a"),
  LocationID: UUID("550f71c0-3c3c-4c13-b6d5-e5992b14618a"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  LocationName: "Витрина B1",
  LocationDescription: "Товары для демонстрации клиентам; Склад «ВолгоМед» — Приемка и резерв",
  LocationStatus: "Active"
},
{
  _id: UUID("9fa09307-8218-4eab-b933-ed77c8ee16ca"),
  LocationID: UUID("9fa09307-8218-4eab-b933-ed77c8ee16ca"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  LocationName: "Ячейка C1",
  LocationDescription: "Комплектация онлайн-заказов; Склад «ВолгоМед» — Приемка и резерв",
  LocationStatus: "Active"
},
{
  _id: UUID("4104b281-7efc-4076-8e2a-30a4d188621a"),
  LocationID: UUID("4104b281-7efc-4076-8e2a-30a4d188621a"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  LocationName: "Зона приемки D1",
  LocationDescription: "Временное хранение после прихода; Склад «ВолгоМед» — Приемка и резерв",
  LocationStatus: "Active"
},
{
  _id: UUID("435dcd07-aae3-4ec1-9b94-af37918482aa"),
  LocationID: UUID("435dcd07-aae3-4ec1-9b94-af37918482aa"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  LocationName: "Стеллаж А1",
  LocationDescription: "Основная выкладка ходовых товаров; Склад «ВолгоМед» — Интернет-заказы",
  LocationStatus: "Active"
},
{
  _id: UUID("a74dd362-5dff-426e-a6b6-f67a5f3dea8f"),
  LocationID: UUID("a74dd362-5dff-426e-a6b6-f67a5f3dea8f"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  LocationName: "Стеллаж А2",
  LocationDescription: "Резервные упаковки и коробочный запас; Склад «ВолгоМед» — Интернет-заказы",
  LocationStatus: "Active"
},
{
  _id: UUID("c255b9df-9591-4e64-a1b7-d80b90ed8ac3"),
  LocationID: UUID("c255b9df-9591-4e64-a1b7-d80b90ed8ac3"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  LocationName: "Витрина B1",
  LocationDescription: "Товары для демонстрации клиентам; Склад «ВолгоМед» — Интернет-заказы",
  LocationStatus: "Active"
},
{
  _id: UUID("b4c17ffb-b349-4191-9191-585fcde22de8"),
  LocationID: UUID("b4c17ffb-b349-4191-9191-585fcde22de8"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  LocationName: "Ячейка C1",
  LocationDescription: "Комплектация онлайн-заказов; Склад «ВолгоМед» — Интернет-заказы",
  LocationStatus: "Active"
},
{
  _id: UUID("0315f2cd-33bf-41a3-802b-8514ba2c4905"),
  LocationID: UUID("0315f2cd-33bf-41a3-802b-8514ba2c4905"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  LocationName: "Зона приемки D1",
  LocationDescription: "Временное хранение после прихода; Склад «ВолгоМед» — Интернет-заказы",
  LocationStatus: "Active"
}
];
database.getCollection("locations").insertMany(locations);

const products = [
{
  _id: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  CategoryID: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  ProductName: "Ортопедические стельки детские ORTO KIDS",
  ProductSKU: "ORT-KIDS-001",
  ProductUnit: "пара",
  ProductPrice: 1290.00,
  ProductQuantity: 197,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  CategoryID: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  ProductName: "Ортопедические стельки Comfort Plus",
  ProductSKU: "ORT-COMF-002",
  ProductUnit: "пара",
  ProductPrice: 1590.00,
  ProductQuantity: 188,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  CategoryID: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  ProductName: "Бандаж коленный усиленный Т-8508",
  ProductSKU: "BND-KNEE-8508",
  ProductUnit: "шт.",
  ProductPrice: 2490.00,
  ProductQuantity: 0,
  ProductAvailability: "Под заказ"
},
{
  _id: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  CategoryID: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  ProductName: "Бандаж голеностопный эластичный",
  ProductSKU: "BND-ANKLE-114",
  ProductUnit: "шт.",
  ProductPrice: 1180.00,
  ProductQuantity: 98,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  CategoryID: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  ProductName: "Корсет пояснично-крестцовый",
  ProductSKU: "KOR-LUMB-421",
  ProductUnit: "шт.",
  ProductPrice: 4290.00,
  ProductQuantity: 158,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  CategoryID: UUID("3c7d68d1-1e72-42d3-a87e-5e47c5fbdaf3"),
  ProductName: "Корректор осанки медицинский",
  ProductSKU: "KOR-POST-214",
  ProductUnit: "шт.",
  ProductPrice: 2190.00,
  ProductQuantity: 83,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  CategoryID: UUID("fa84dd9b-5766-43d4-8175-43f0ba0f5a44"),
  ProductName: "Гольфы компрессионные I класс",
  ProductSKU: "CMP-GOLF-1-101",
  ProductUnit: "пара",
  ProductPrice: 1990.00,
  ProductQuantity: 93,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  CategoryID: UUID("fa84dd9b-5766-43d4-8175-43f0ba0f5a44"),
  ProductName: "Гольфы компрессионные II класс",
  ProductSKU: "CMP-GOLF-2-102",
  ProductUnit: "пара",
  ProductPrice: 2390.00,
  ProductQuantity: 71,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  CategoryID: UUID("fa84dd9b-5766-43d4-8175-43f0ba0f5a44"),
  ProductName: "Чулки компрессионные I класс",
  ProductSKU: "CMP-STOCK-1-201",
  ProductUnit: "пара",
  ProductPrice: 2890.00,
  ProductQuantity: 244,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  CategoryID: UUID("fa84dd9b-5766-43d4-8175-43f0ba0f5a44"),
  ProductName: "Чулки компрессионные II класс",
  ProductSKU: "CMP-STOCK-2-202",
  ProductUnit: "пара",
  ProductPrice: 3490.00,
  ProductQuantity: 35,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  CategoryID: UUID("fa84dd9b-5766-43d4-8175-43f0ba0f5a44"),
  ProductName: "Колготки компрессионные для женщин",
  ProductSKU: "CMP-TIGHTS-303",
  ProductUnit: "шт.",
  ProductPrice: 3790.00,
  ProductQuantity: 59,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  CategoryID: UUID("52f3b86b-6a40-4cff-9db6-f9803307f20e"),
  ProductName: "Трость телескопическая алюминиевая",
  ProductSKU: "REH-CANE-011",
  ProductUnit: "шт.",
  ProductPrice: 1370.00,
  ProductQuantity: 87,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  CategoryID: UUID("52f3b86b-6a40-4cff-9db6-f9803307f20e"),
  ProductName: "Ходунки складные регулируемые",
  ProductSKU: "REH-WALK-022",
  ProductUnit: "шт.",
  ProductPrice: 5490.00,
  ProductQuantity: 50,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  CategoryID: UUID("52f3b86b-6a40-4cff-9db6-f9803307f20e"),
  ProductName: "Подушка ортопедическая шейная",
  ProductSKU: "REH-PILLOW-033",
  ProductUnit: "шт.",
  ProductPrice: 2650.00,
  ProductQuantity: 115,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  SupplierID: UUID("f5e17990-2ce6-4b75-aee7-51afd0832baf"),
  CategoryID: UUID("cc2ed40d-e8a1-4a5d-b783-76052890658b"),
  ProductName: "Катетер урологический Nelaton",
  ProductSKU: "URO-NEL-010",
  ProductUnit: "уп.",
  ProductPrice: 790.00,
  ProductQuantity: 0,
  ProductAvailability: "Под заказ"
},
{
  _id: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  SupplierID: UUID("f5e17990-2ce6-4b75-aee7-51afd0832baf"),
  CategoryID: UUID("cc2ed40d-e8a1-4a5d-b783-76052890658b"),
  ProductName: "Мочеприемник ножной 750 мл",
  ProductSKU: "URO-BAG-750",
  ProductUnit: "шт.",
  ProductPrice: 560.00,
  ProductQuantity: 0,
  ProductAvailability: "Под заказ"
},
{
  _id: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  CategoryID: UUID("f7fb8b6d-7337-47ff-be8d-e66cd6515719"),
  ProductName: "Пеленки одноразовые 60x90",
  ProductSKU: "MED-PEL-6090",
  ProductUnit: "уп.",
  ProductPrice: 680.00,
  ProductQuantity: 45,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  CategoryID: UUID("f7fb8b6d-7337-47ff-be8d-e66cd6515719"),
  ProductName: "Перчатки нитриловые неопудренные",
  ProductSKU: "MED-GLOVES-NIT",
  ProductUnit: "уп.",
  ProductPrice: 920.00,
  ProductQuantity: 46,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  CategoryID: UUID("f7fb8b6d-7337-47ff-be8d-e66cd6515719"),
  ProductName: "Средство для ухода за кожей Seni Care",
  ProductSKU: "MED-SENI-CARE",
  ProductUnit: "шт.",
  ProductPrice: 490.00,
  ProductQuantity: 86,
  ProductAvailability: "В наличии"
},
{
  _id: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  CategoryID: UUID("f7fb8b6d-7337-47ff-be8d-e66cd6515719"),
  ProductName: "Салфетки влажные медицинские",
  ProductSKU: "MED-WIPES-100",
  ProductUnit: "уп.",
  ProductPrice: 310.00,
  ProductQuantity: 40,
  ProductAvailability: "В наличии"
}
];
database.getCollection("products").insertMany(products);

const productLocations = [
{
  LocationID: UUID("5b9c5965-85e6-4572-9128-def204639d6f"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  ProductQuantity: 197
},
{
  LocationID: UUID("efc3d207-ddbc-45ef-8638-0c1da247925d"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  ProductQuantity: 83
},
{
  LocationID: UUID("1866e08d-ead4-416c-9c1f-c9d258e3ecfc"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  ProductQuantity: 32
},
{
  LocationID: UUID("c255b9df-9591-4e64-a1b7-d80b90ed8ac3"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  ProductQuantity: 73
},
{
  LocationID: UUID("0315f2cd-33bf-41a3-802b-8514ba2c4905"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  ProductQuantity: 98
},
{
  LocationID: UUID("1866e08d-ead4-416c-9c1f-c9d258e3ecfc"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  ProductQuantity: 47
},
{
  LocationID: UUID("4a452ebb-e215-4e7d-9c23-dea13d2cd2f9"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  ProductQuantity: 111
},
{
  LocationID: UUID("b4c17ffb-b349-4191-9191-585fcde22de8"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  ProductQuantity: 35
},
{
  LocationID: UUID("4104b281-7efc-4076-8e2a-30a4d188621a"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  ProductQuantity: 24
},
{
  LocationID: UUID("9fa09307-8218-4eab-b933-ed77c8ee16ca"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  ProductQuantity: 24
},
{
  LocationID: UUID("a74dd362-5dff-426e-a6b6-f67a5f3dea8f"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  ProductQuantity: 93
},
{
  LocationID: UUID("c255b9df-9591-4e64-a1b7-d80b90ed8ac3"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  ProductQuantity: 23
},
{
  LocationID: UUID("a2e45509-0cd0-4af8-a5d5-94efb14da462"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  ProductQuantity: 48
},
{
  LocationID: UUID("63d56755-0540-4725-a711-5cbbf0ab01c1"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  ProductQuantity: 28
},
{
  LocationID: UUID("5b9c5965-85e6-4572-9128-def204639d6f"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  ProductQuantity: 50
},
{
  LocationID: UUID("c255b9df-9591-4e64-a1b7-d80b90ed8ac3"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  ProductQuantity: 166
},
{
  LocationID: UUID("1866e08d-ead4-416c-9c1f-c9d258e3ecfc"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  ProductQuantity: 11
},
{
  LocationID: UUID("a74dd362-5dff-426e-a6b6-f67a5f3dea8f"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  ProductQuantity: 6
},
{
  LocationID: UUID("4104b281-7efc-4076-8e2a-30a4d188621a"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  ProductQuantity: 18
},
{
  LocationID: UUID("a74dd362-5dff-426e-a6b6-f67a5f3dea8f"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  ProductQuantity: 29
},
{
  LocationID: UUID("4104b281-7efc-4076-8e2a-30a4d188621a"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  ProductQuantity: 30
},
{
  LocationID: UUID("a74dd362-5dff-426e-a6b6-f67a5f3dea8f"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  ProductQuantity: 15
},
{
  LocationID: UUID("4a452ebb-e215-4e7d-9c23-dea13d2cd2f9"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  ProductQuantity: 10
},
{
  LocationID: UUID("70dfddad-b6d1-4d49-94cf-24de6313fee0"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  ProductQuantity: 62
},
{
  LocationID: UUID("70dfddad-b6d1-4d49-94cf-24de6313fee0"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  ProductQuantity: 1
},
{
  LocationID: UUID("6d6356b3-dd96-46b6-b055-ede5316dbba4"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  ProductQuantity: 24
},
{
  LocationID: UUID("9fa09307-8218-4eab-b933-ed77c8ee16ca"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  ProductQuantity: 25
},
{
  LocationID: UUID("7d3c2ac7-1dc5-4fa4-8ab5-3335b02a4af5"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  ProductQuantity: 29
},
{
  LocationID: UUID("550f71c0-3c3c-4c13-b6d5-e5992b14618a"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  ProductQuantity: 86
},
{
  LocationID: UUID("550f71c0-3c3c-4c13-b6d5-e5992b14618a"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  ProductQuantity: 45
},
{
  LocationID: UUID("435dcd07-aae3-4ec1-9b94-af37918482aa"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  ProductQuantity: 8
},
{
  LocationID: UUID("4a452ebb-e215-4e7d-9c23-dea13d2cd2f9"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  ProductQuantity: 6
},
{
  LocationID: UUID("550f71c0-3c3c-4c13-b6d5-e5992b14618a"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  ProductQuantity: 32
},
{
  LocationID: UUID("1866e08d-ead4-416c-9c1f-c9d258e3ecfc"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  ProductQuantity: 34
},
{
  LocationID: UUID("9fa09307-8218-4eab-b933-ed77c8ee16ca"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  ProductQuantity: 3
},
{
  LocationID: UUID("b4c17ffb-b349-4191-9191-585fcde22de8"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  ProductQuantity: 49
},
{
  LocationID: UUID("6d6356b3-dd96-46b6-b055-ede5316dbba4"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  ProductQuantity: 40
}
];
database.getCollection("product-locations").insertMany(productLocations);

const customers = [
{
  _id: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Анна",
  CustomerLastname: "Петрова",
  CustomerAddress: "г. Волгодонск, ул. Морская, д. 9, кв. 1",
  CustomerPhone: "+7-928-701-07-11",
  CustomerEmail: "client01@mail.local"
},
{
  _id: UUID("2375bfb0-73b6-4db8-a95d-a95d296e529a"),
  CustomerID: UUID("2375bfb0-73b6-4db8-a95d-a95d296e529a"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  CustomerFirstname: "Сергей",
  CustomerLastname: "Иванов",
  CustomerAddress: "г. Волгодонск, ул. Энтузиастов, д. 10, кв. 2",
  CustomerPhone: "+7-928-702-14-22",
  CustomerEmail: "client02@mail.local"
},
{
  _id: UUID("51514043-16b7-46e9-97e9-753a5a62af9a"),
  CustomerID: UUID("51514043-16b7-46e9-97e9-753a5a62af9a"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  CustomerFirstname: "Ольга",
  CustomerLastname: "Морозова",
  CustomerAddress: "г. Волгодонск, ул. Весенняя, д. 11, кв. 3",
  CustomerPhone: "+7-928-703-21-33",
  CustomerEmail: "client03@mail.local"
},
{
  _id: UUID("2980541d-1381-4182-a6de-cf0279954255"),
  CustomerID: UUID("2980541d-1381-4182-a6de-cf0279954255"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Николай",
  CustomerLastname: "Смирнов",
  CustomerAddress: "г. Волгодонск, ул. Строителей, д. 12, кв. 4",
  CustomerPhone: "+7-928-704-28-44",
  CustomerEmail: "client04@mail.local"
},
{
  _id: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  CustomerID: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Виктория",
  CustomerLastname: "Ковалева",
  CustomerAddress: "г. Волгодонск, ул. Дружбы, д. 13, кв. 5",
  CustomerPhone: "+7-928-705-35-55",
  CustomerEmail: "client05@mail.local"
},
{
  _id: UUID("b6b17c36-ef12-47a4-a5a1-0eb13087a2fd"),
  CustomerID: UUID("b6b17c36-ef12-47a4-a5a1-0eb13087a2fd"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  CustomerFirstname: "Дмитрий",
  CustomerLastname: "Алексеев",
  CustomerAddress: "г. Волгодонск, ул. Гагарина, д. 14, кв. 6",
  CustomerPhone: "+7-928-706-42-66",
  CustomerEmail: "client06@mail.local"
},
{
  _id: UUID("3f90211f-174d-437a-8035-3930224097e2"),
  CustomerID: UUID("3f90211f-174d-437a-8035-3930224097e2"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  CustomerFirstname: "Екатерина",
  CustomerLastname: "Романова",
  CustomerAddress: "г. Волгодонск, ул. Курчатова, д. 15, кв. 7",
  CustomerPhone: "+7-928-707-49-77",
  CustomerEmail: "client07@mail.local"
},
{
  _id: UUID("01bc485c-970b-4b21-a952-eb7e2ef36cc7"),
  CustomerID: UUID("01bc485c-970b-4b21-a952-eb7e2ef36cc7"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  CustomerFirstname: "Андрей",
  CustomerLastname: "Попов",
  CustomerAddress: "г. Волгодонск, ул. Советская, д. 16, кв. 8",
  CustomerPhone: "+7-928-708-56-88",
  CustomerEmail: "client08@mail.local"
},
{
  _id: UUID("729300a2-905b-4ad9-a9c6-746bca2f1cbd"),
  CustomerID: UUID("729300a2-905b-4ad9-a9c6-746bca2f1cbd"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Мария",
  CustomerLastname: "Васильева",
  CustomerAddress: "г. Волгодонск, ул. Молодежная, д. 17, кв. 9",
  CustomerPhone: "+7-928-709-63-99",
  CustomerEmail: "client09@mail.local"
},
{
  _id: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Игорь",
  CustomerLastname: "Федоров",
  CustomerAddress: "г. Волгодонск, ул. Ленина, д. 18, кв. 10",
  CustomerPhone: "+7-928-710-70-10",
  CustomerEmail: "client10@mail.local"
},
{
  _id: UUID("78a6fb3e-2503-4d1b-bff2-34a42dae1c38"),
  CustomerID: UUID("78a6fb3e-2503-4d1b-bff2-34a42dae1c38"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Татьяна",
  CustomerLastname: "Зайцева",
  CustomerAddress: "г. Волгодонск, ул. Морская, д. 19, кв. 11",
  CustomerPhone: "+7-928-711-77-21",
  CustomerEmail: "client11@mail.local"
},
{
  _id: UUID("878799a7-eae6-4ce8-9e91-2f112505d732"),
  CustomerID: UUID("878799a7-eae6-4ce8-9e91-2f112505d732"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Артем",
  CustomerLastname: "Новиков",
  CustomerAddress: "г. Волгодонск, ул. Энтузиастов, д. 20, кв. 12",
  CustomerPhone: "+7-928-712-84-32",
  CustomerEmail: "client12@mail.local"
},
{
  _id: UUID("08946f79-71e0-41d9-8c53-31689c3abfbd"),
  CustomerID: UUID("08946f79-71e0-41d9-8c53-31689c3abfbd"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Наталья",
  CustomerLastname: "Киселева",
  CustomerAddress: "г. Волгодонск, ул. Весенняя, д. 21, кв. 13",
  CustomerPhone: "+7-928-713-91-43",
  CustomerEmail: "client13@mail.local"
},
{
  _id: UUID("567171a0-5ff2-4e97-9fde-2a1202eb47d5"),
  CustomerID: UUID("567171a0-5ff2-4e97-9fde-2a1202eb47d5"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  CustomerFirstname: "Владимир",
  CustomerLastname: "Орлов",
  CustomerAddress: "г. Волгодонск, ул. Строителей, д. 22, кв. 14",
  CustomerPhone: "+7-928-714-98-54",
  CustomerEmail: "client14@mail.local"
},
{
  _id: UUID("8df26cdf-c574-4dc9-b646-35d2a870f821"),
  CustomerID: UUID("8df26cdf-c574-4dc9-b646-35d2a870f821"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  CustomerFirstname: "Юлия",
  CustomerLastname: "Беляева",
  CustomerAddress: "г. Волгодонск, ул. Дружбы, д. 23, кв. 15",
  CustomerPhone: "+7-928-715-05-65",
  CustomerEmail: "client15@mail.local"
},
{
  _id: UUID("0c196312-145a-4819-996d-d1185167155a"),
  CustomerID: UUID("0c196312-145a-4819-996d-d1185167155a"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Руслан",
  CustomerLastname: "Комаров",
  CustomerAddress: "г. Волгодонск, ул. Гагарина, д. 24, кв. 16",
  CustomerPhone: "+7-928-716-12-76",
  CustomerEmail: "client16@mail.local"
},
{
  _id: UUID("cb1f1047-66cc-4488-baea-843708ad9241"),
  CustomerID: UUID("cb1f1047-66cc-4488-baea-843708ad9241"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Светлана",
  CustomerLastname: "Гусева",
  CustomerAddress: "г. Волгодонск, ул. Курчатова, д. 25, кв. 17",
  CustomerPhone: "+7-928-717-19-87",
  CustomerEmail: "client17@mail.local"
},
{
  _id: UUID("14544af5-45ca-4e3b-a9cd-fd72cf09b85f"),
  CustomerID: UUID("14544af5-45ca-4e3b-a9cd-fd72cf09b85f"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  CustomerFirstname: "Михаил",
  CustomerLastname: "Соколов",
  CustomerAddress: "г. Волгодонск, ул. Советская, д. 26, кв. 18",
  CustomerPhone: "+7-928-718-26-98",
  CustomerEmail: "client18@mail.local"
},
{
  _id: UUID("ea1bb343-ca15-4d4c-9f6d-fa1ec33338f0"),
  CustomerID: UUID("ea1bb343-ca15-4d4c-9f6d-fa1ec33338f0"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Лариса",
  CustomerLastname: "Павлова",
  CustomerAddress: "г. Волгодонск, ул. Молодежная, д. 27, кв. 19",
  CustomerPhone: "+7-928-719-33-09",
  CustomerEmail: "client19@mail.local"
},
{
  _id: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  CustomerID: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Георгий",
  CustomerLastname: "Мельников",
  CustomerAddress: "г. Волгодонск, ул. Ленина, д. 28, кв. 20",
  CustomerPhone: "+7-928-720-40-20",
  CustomerEmail: "client20@mail.local"
},
{
  _id: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  CustomerFirstname: "Кристина",
  CustomerLastname: "Захарова",
  CustomerAddress: "г. Волгодонск, ул. Морская, д. 29, кв. 21",
  CustomerPhone: "+7-928-721-47-31",
  CustomerEmail: "client21@mail.local"
},
{
  _id: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Роман",
  CustomerLastname: "Семенов",
  CustomerAddress: "г. Волгодонск, ул. Энтузиастов, д. 30, кв. 22",
  CustomerPhone: "+7-928-722-54-42",
  CustomerEmail: "client22@mail.local"
},
{
  _id: UUID("276e989d-fc0c-46cd-a554-b483b27971b8"),
  CustomerID: UUID("276e989d-fc0c-46cd-a554-b483b27971b8"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Алина",
  CustomerLastname: "Тихонова",
  CustomerAddress: "г. Волгодонск, ул. Весенняя, д. 31, кв. 23",
  CustomerPhone: "+7-928-723-61-53",
  CustomerEmail: "client23@mail.local"
},
{
  _id: UUID("d1e8f50e-45a6-4110-b316-e70755da1a56"),
  CustomerID: UUID("d1e8f50e-45a6-4110-b316-e70755da1a56"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Валерий",
  CustomerLastname: "Макаров",
  CustomerAddress: "г. Волгодонск, ул. Строителей, д. 32, кв. 24",
  CustomerPhone: "+7-928-724-68-64",
  CustomerEmail: "client24@mail.local"
},
{
  _id: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  CustomerID: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  CustomerFirstname: "Диана",
  CustomerLastname: "Орлова",
  CustomerAddress: "г. Волгодонск, ул. Дружбы, д. 33, кв. 25",
  CustomerPhone: "+7-928-725-75-75",
  CustomerEmail: "client25@mail.local"
},
{
  _id: UUID("61979607-c114-4795-88c5-3d1d4de0dc67"),
  CustomerID: UUID("61979607-c114-4795-88c5-3d1d4de0dc67"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Петр",
  CustomerLastname: "Беляев",
  CustomerAddress: "г. Волгодонск, ул. Гагарина, д. 34, кв. 26",
  CustomerPhone: "+7-928-726-82-86",
  CustomerEmail: "client26@mail.local"
},
{
  _id: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  CustomerID: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Евгения",
  CustomerLastname: "Лазарева",
  CustomerAddress: "г. Волгодонск, ул. Курчатова, д. 35, кв. 27",
  CustomerPhone: "+7-928-727-89-97",
  CustomerEmail: "client27@mail.local"
},
{
  _id: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  CustomerFirstname: "Станислав",
  CustomerLastname: "Кириллов",
  CustomerAddress: "г. Волгодонск, ул. Советская, д. 36, кв. 28",
  CustomerPhone: "+7-928-728-96-08",
  CustomerEmail: "client28@mail.local"
},
{
  _id: UUID("66d35801-d16c-495b-9312-a1e3a446fe92"),
  CustomerID: UUID("66d35801-d16c-495b-9312-a1e3a446fe92"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  CustomerFirstname: "Полина",
  CustomerLastname: "Котова",
  CustomerAddress: "г. Волгодонск, ул. Молодежная, д. 37, кв. 29",
  CustomerPhone: "+7-928-729-03-19",
  CustomerEmail: "client29@mail.local"
},
{
  _id: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  CustomerID: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  CustomerFirstname: "Олег",
  CustomerLastname: "Фролов",
  CustomerAddress: "г. Волгодонск, ул. Ленина, д. 38, кв. 30",
  CustomerPhone: "+7-928-730-10-30",
  CustomerEmail: "client30@mail.local"
}
];
database.getCollection("customers").insertMany(customers);

const purchaseReceipts = [
{
  _id: UUID("0c9d8fe0-510b-4464-b559-d6281f6cb0fd"),
  PurchaseReceiptID: UUID("0c9d8fe0-510b-4464-b559-d6281f6cb0fd"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "УПД-2026-02-0001",
  Quantity: 52,
  UnitPrice: 725.87,
  TotalAmount: 37745.24,
  PurchasedAt: ISODate("2026-02-03T15:50:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("5db69d1e-d8b7-4050-9b54-d31f22a3760a"),
  PurchaseReceiptID: UUID("5db69d1e-d8b7-4050-9b54-d31f22a3760a"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "НАКЛ-2026-02-0002",
  Quantity: 61,
  UnitPrice: 914.84,
  TotalAmount: 55805.24,
  PurchasedAt: ISODate("2026-02-07T09:15:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("bf30068d-c352-4a79-be20-3ee620823e03"),
  PurchaseReceiptID: UUID("bf30068d-c352-4a79-be20-3ee620823e03"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  DocumentNumber: "ЗКП-2026-02-0003",
  Quantity: 24,
  UnitPrice: 1002.49,
  TotalAmount: 24059.76,
  PurchasedAt: ISODate("2026-02-07T17:00:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("7179a8ce-17b2-4782-b9f7-a958c3f00300"),
  PurchaseReceiptID: UUID("7179a8ce-17b2-4782-b9f7-a958c3f00300"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "УПД-2026-02-0004",
  Quantity: 41,
  UnitPrice: 1123.06,
  TotalAmount: 46045.46,
  PurchasedAt: ISODate("2026-02-09T13:45:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("c6f201a8-b5a3-412a-966f-0722643e539d"),
  PurchaseReceiptID: UUID("c6f201a8-b5a3-412a-966f-0722643e539d"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "НАКЛ-2026-02-0005",
  Quantity: 54,
  UnitPrice: 1621.81,
  TotalAmount: 87577.74,
  PurchasedAt: ISODate("2026-02-15T13:40:00"),
  Comment: "Поставка под сезонный спрос"
},
{
  _id: UUID("2d6678e8-6251-4681-b406-826c6327b6dc"),
  PurchaseReceiptID: UUID("2d6678e8-6251-4681-b406-826c6327b6dc"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "ЗКП-2026-02-0006",
  Quantity: 41,
  UnitPrice: 1199.09,
  TotalAmount: 49162.69,
  PurchasedAt: ISODate("2026-02-15T13:30:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("dd5cdce4-330c-42a4-9492-eaf1de02ffd6"),
  PurchaseReceiptID: UUID("dd5cdce4-330c-42a4-9492-eaf1de02ffd6"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-02-0007",
  Quantity: 32,
  UnitPrice: 1130.24,
  TotalAmount: 36167.68,
  PurchasedAt: ISODate("2026-02-22T08:15:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("f452aad8-e6db-4e84-a7ca-0d66ee19e784"),
  PurchaseReceiptID: UUID("f452aad8-e6db-4e84-a7ca-0d66ee19e784"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "НАКЛ-2026-02-0008",
  Quantity: 40,
  UnitPrice: 853.86,
  TotalAmount: 34154.40,
  PurchasedAt: ISODate("2026-02-23T14:45:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("425d06a4-86b0-4da4-ad1e-9701b13af8d3"),
  PurchaseReceiptID: UUID("425d06a4-86b0-4da4-ad1e-9701b13af8d3"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "ЗКП-2026-02-0009",
  Quantity: 39,
  UnitPrice: 1124.69,
  TotalAmount: 43862.91,
  PurchasedAt: ISODate("2026-02-27T08:40:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("f2148a8a-6811-4d2f-8ddd-e4720057ab3f"),
  PurchaseReceiptID: UUID("f2148a8a-6811-4d2f-8ddd-e4720057ab3f"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-03-0001",
  Quantity: 54,
  UnitPrice: 1569.31,
  TotalAmount: 84742.74,
  PurchasedAt: ISODate("2026-03-03T15:10:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("f5e1f6c1-6ad6-4de6-8943-abca100eba2e"),
  PurchaseReceiptID: UUID("f5e1f6c1-6ad6-4de6-8943-abca100eba2e"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "НАКЛ-2026-03-0002",
  Quantity: 45,
  UnitPrice: 262.78,
  TotalAmount: 11825.10,
  PurchasedAt: ISODate("2026-03-03T14:50:00"),
  Comment: "Дозаказ после проверки складских остатков"
},
{
  _id: UUID("ca8a06cb-c4e7-40f8-9bed-e6987a5cd270"),
  PurchaseReceiptID: UUID("ca8a06cb-c4e7-40f8-9bed-e6987a5cd270"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "ЗКП-2026-03-0003",
  Quantity: 44,
  UnitPrice: 2221.61,
  TotalAmount: 97750.84,
  PurchasedAt: ISODate("2026-03-07T13:20:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("6ffa7fc8-caef-458a-b38e-459f604ca39a"),
  PurchaseReceiptID: UUID("6ffa7fc8-caef-458a-b38e-459f604ca39a"),
  SupplierID: UUID("f5e17990-2ce6-4b75-aee7-51afd0832baf"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "УПД-2026-03-0004",
  Quantity: 14,
  UnitPrice: 349.67,
  TotalAmount: 4895.38,
  PurchasedAt: ISODate("2026-03-07T16:15:00"),
  Comment: "Поставка под сезонный спрос"
},
{
  _id: UUID("c12b55fe-89f0-4211-8ae4-8046d3a758d1"),
  PurchaseReceiptID: UUID("c12b55fe-89f0-4211-8ae4-8046d3a758d1"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "НАКЛ-2026-03-0005",
  Quantity: 10,
  UnitPrice: 352.19,
  TotalAmount: 3521.90,
  PurchasedAt: ISODate("2026-03-09T10:00:00"),
  Comment: "Поставка под сезонный спрос"
},
{
  _id: UUID("ebd69027-e038-4347-b512-ebd124826d15"),
  PurchaseReceiptID: UUID("ebd69027-e038-4347-b512-ebd124826d15"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "ЗКП-2026-03-0006",
  Quantity: 59,
  UnitPrice: 1060.84,
  TotalAmount: 62589.56,
  PurchasedAt: ISODate("2026-03-14T15:50:00"),
  Comment: "Дозаказ после проверки складских остатков"
},
{
  _id: UUID("e4d96841-73bf-4d41-b486-878ed89189a3"),
  PurchaseReceiptID: UUID("e4d96841-73bf-4d41-b486-878ed89189a3"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "УПД-2026-03-0007",
  Quantity: 63,
  UnitPrice: 921.21,
  TotalAmount: 58036.23,
  PurchasedAt: ISODate("2026-03-16T14:50:00"),
  Comment: "Дозаказ после проверки складских остатков"
},
{
  _id: UUID("02f3fda1-74df-4d92-912c-fdedb9b06ae4"),
  PurchaseReceiptID: UUID("02f3fda1-74df-4d92-912c-fdedb9b06ae4"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "НАКЛ-2026-03-0008",
  Quantity: 57,
  UnitPrice: 1694.01,
  TotalAmount: 96558.57,
  PurchasedAt: ISODate("2026-03-14T16:10:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("6edfcac7-b53f-4e86-b8e9-5a62674b92d3"),
  PurchaseReceiptID: UUID("6edfcac7-b53f-4e86-b8e9-5a62674b92d3"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "ЗКП-2026-03-0009",
  Quantity: 20,
  UnitPrice: 795.43,
  TotalAmount: 15908.60,
  PurchasedAt: ISODate("2026-03-20T09:40:00"),
  Comment: "Поставка под сезонный спрос"
},
{
  _id: UUID("753788b0-23a6-43c0-8c06-7a4146aeb2bf"),
  PurchaseReceiptID: UUID("753788b0-23a6-43c0-8c06-7a4146aeb2bf"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  DocumentNumber: "УПД-2026-03-0010",
  Quantity: 33,
  UnitPrice: 379.22,
  TotalAmount: 12514.26,
  PurchasedAt: ISODate("2026-03-21T14:40:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("66ee96ab-ca0f-4294-b696-ce43659ffac6"),
  PurchaseReceiptID: UUID("66ee96ab-ca0f-4294-b696-ce43659ffac6"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "НАКЛ-2026-03-0011",
  Quantity: 21,
  UnitPrice: 604.05,
  TotalAmount: 12685.05,
  PurchasedAt: ISODate("2026-03-23T15:45:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("cb8b411b-015a-45b7-8b4c-71df4cb7a64f"),
  PurchaseReceiptID: UUID("cb8b411b-015a-45b7-8b4c-71df4cb7a64f"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "ЗКП-2026-03-0012",
  Quantity: 30,
  UnitPrice: 1238.96,
  TotalAmount: 37168.80,
  PurchasedAt: ISODate("2026-03-27T15:15:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("150591d0-1194-4d5b-bd46-7ffb3c70315a"),
  PurchaseReceiptID: UUID("150591d0-1194-4d5b-bd46-7ffb3c70315a"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "УПД-2026-03-0013",
  Quantity: 52,
  UnitPrice: 2882.00,
  TotalAmount: 149864.00,
  PurchasedAt: ISODate("2026-03-25T09:10:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("51c3a6f6-3921-4f31-9117-01a36721d1f0"),
  PurchaseReceiptID: UUID("51c3a6f6-3921-4f31-9117-01a36721d1f0"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "НАКЛ-2026-03-0014",
  Quantity: 14,
  UnitPrice: 1522.91,
  TotalAmount: 21320.74,
  PurchasedAt: ISODate("2026-03-31T12:15:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("0063414b-4c1b-4da5-b915-11108d951372"),
  PurchaseReceiptID: UUID("0063414b-4c1b-4da5-b915-11108d951372"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "УПД-2026-04-0001",
  Quantity: 55,
  UnitPrice: 1841.22,
  TotalAmount: 101267.10,
  PurchasedAt: ISODate("2026-04-04T16:45:00"),
  Comment: "Дозаказ после проверки складских остатков"
},
{
  _id: UUID("3bef71cd-429e-46bd-9397-c72baf8fea7a"),
  PurchaseReceiptID: UUID("3bef71cd-429e-46bd-9397-c72baf8fea7a"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "НАКЛ-2026-04-0002",
  Quantity: 52,
  UnitPrice: 2648.27,
  TotalAmount: 137710.04,
  PurchasedAt: ISODate("2026-04-02T13:15:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("d5226fc6-6580-4998-8446-3b43461b2a87"),
  PurchaseReceiptID: UUID("d5226fc6-6580-4998-8446-3b43461b2a87"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "ЗКП-2026-04-0003",
  Quantity: 31,
  UnitPrice: 1763.15,
  TotalAmount: 54657.65,
  PurchasedAt: ISODate("2026-04-07T13:50:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("d2638304-b0af-47a2-9216-4ea79f8d6681"),
  PurchaseReceiptID: UUID("d2638304-b0af-47a2-9216-4ea79f8d6681"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "УПД-2026-04-0004",
  Quantity: 15,
  UnitPrice: 3477.45,
  TotalAmount: 52161.75,
  PurchasedAt: ISODate("2026-04-09T11:45:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("fa4de859-e27f-44b4-8112-85241f071a6f"),
  PurchaseReceiptID: UUID("fa4de859-e27f-44b4-8112-85241f071a6f"),
  SupplierID: UUID("f5e17990-2ce6-4b75-aee7-51afd0832baf"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "НАКЛ-2026-04-0005",
  Quantity: 16,
  UnitPrice: 539.77,
  TotalAmount: 8636.32,
  PurchasedAt: ISODate("2026-04-14T17:15:00"),
  Comment: "Дозаказ после проверки складских остатков"
},
{
  _id: UUID("8314740e-0b86-4f37-b4d9-5903f57d0dfb"),
  PurchaseReceiptID: UUID("8314740e-0b86-4f37-b4d9-5903f57d0dfb"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "ЗКП-2026-04-0006",
  Quantity: 50,
  UnitPrice: 950.54,
  TotalAmount: 47527.00,
  PurchasedAt: ISODate("2026-04-17T13:00:00"),
  Comment: "Поставка под сезонный спрос"
},
{
  _id: UUID("3b82177d-b832-4880-a00a-a6c89a3dfa0e"),
  PurchaseReceiptID: UUID("3b82177d-b832-4880-a00a-a6c89a3dfa0e"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-04-0007",
  Quantity: 46,
  UnitPrice: 1514.88,
  TotalAmount: 69684.48,
  PurchasedAt: ISODate("2026-04-18T13:15:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("e970d423-0c95-4266-94b3-bddf15c97c21"),
  PurchaseReceiptID: UUID("e970d423-0c95-4266-94b3-bddf15c97c21"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "НАКЛ-2026-04-0008",
  Quantity: 40,
  UnitPrice: 1498.60,
  TotalAmount: 59944.00,
  PurchasedAt: ISODate("2026-04-20T09:10:00"),
  Comment: "Поставка под сезонный спрос"
},
{
  _id: UUID("ec71aa24-87da-4de7-b768-64a3115b1d44"),
  PurchaseReceiptID: UUID("ec71aa24-87da-4de7-b768-64a3115b1d44"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "ЗКП-2026-04-0009",
  Quantity: 28,
  UnitPrice: 1818.93,
  TotalAmount: 50930.04,
  PurchasedAt: ISODate("2026-04-26T15:00:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("a517dd01-d0c1-468b-acae-6f3955415c39"),
  PurchaseReceiptID: UUID("a517dd01-d0c1-468b-acae-6f3955415c39"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-04-0010",
  Quantity: 37,
  UnitPrice: 759.05,
  TotalAmount: 28084.85,
  PurchasedAt: ISODate("2026-04-27T15:00:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("d2b4ab76-35f0-48fb-82a3-9c5b291e9612"),
  PurchaseReceiptID: UUID("d2b4ab76-35f0-48fb-82a3-9c5b291e9612"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "УПД-2026-05-0001",
  Quantity: 21,
  UnitPrice: 1627.95,
  TotalAmount: 34186.95,
  PurchasedAt: ISODate("2026-05-01T13:30:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("9e350dec-f366-4c72-beea-8fd0b873b163"),
  PurchaseReceiptID: UUID("9e350dec-f366-4c72-beea-8fd0b873b163"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  DocumentNumber: "НАКЛ-2026-05-0002",
  Quantity: 41,
  UnitPrice: 339.28,
  TotalAmount: 13910.48,
  PurchasedAt: ISODate("2026-05-03T12:20:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("b8d66365-f28c-4349-810c-6ebb90bd24e8"),
  PurchaseReceiptID: UUID("b8d66365-f28c-4349-810c-6ebb90bd24e8"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  DocumentNumber: "ЗКП-2026-05-0003",
  Quantity: 63,
  UnitPrice: 3740.95,
  TotalAmount: 235679.85,
  PurchasedAt: ISODate("2026-05-05T11:50:00"),
  Comment: "Дозаказ после проверки складских остатков"
},
{
  _id: UUID("69c7af83-1aa3-4b69-b4aa-766a3545088f"),
  PurchaseReceiptID: UUID("69c7af83-1aa3-4b69-b4aa-766a3545088f"),
  SupplierID: UUID("e4fa8845-ff51-4531-8574-970bd398dfb1"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "УПД-2026-05-0004",
  Quantity: 24,
  UnitPrice: 1506.92,
  TotalAmount: 36166.08,
  PurchasedAt: ISODate("2026-05-09T17:30:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("d45afc40-09fa-4db0-9241-7f1d0ef4bc37"),
  PurchaseReceiptID: UUID("d45afc40-09fa-4db0-9241-7f1d0ef4bc37"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  WarehouseID: UUID("a77bc88e-82da-418b-bdf3-abe9967b1c6a"),
  DocumentNumber: "НАКЛ-2026-05-0005",
  Quantity: 54,
  UnitPrice: 617.68,
  TotalAmount: 33354.72,
  PurchasedAt: ISODate("2026-05-09T14:10:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("a393dcaa-62ec-456d-bff3-e8fdbc524fb9"),
  PurchaseReceiptID: UUID("a393dcaa-62ec-456d-bff3-e8fdbc524fb9"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "ЗКП-2026-05-0006",
  Quantity: 37,
  UnitPrice: 780.96,
  TotalAmount: 28895.52,
  PurchasedAt: ISODate("2026-05-10T11:20:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("150fadb7-4ed4-42b7-b2fd-aeed675bf12e"),
  PurchaseReceiptID: UUID("150fadb7-4ed4-42b7-b2fd-aeed675bf12e"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-05-0007",
  Quantity: 64,
  UnitPrice: 839.52,
  TotalAmount: 53729.28,
  PurchasedAt: ISODate("2026-05-12T08:20:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("14323cfe-1cfd-4ddb-92f4-3f7cde1d9fa8"),
  PurchaseReceiptID: UUID("14323cfe-1cfd-4ddb-92f4-3f7cde1d9fa8"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "НАКЛ-2026-05-0008",
  Quantity: 38,
  UnitPrice: 1037.81,
  TotalAmount: 39436.78,
  PurchasedAt: ISODate("2026-05-14T16:00:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("8bf81b39-6839-46a7-a7e9-369799d5c8ed"),
  PurchaseReceiptID: UUID("8bf81b39-6839-46a7-a7e9-369799d5c8ed"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "ЗКП-2026-05-0009",
  Quantity: 49,
  UnitPrice: 1563.28,
  TotalAmount: 76600.72,
  PurchasedAt: ISODate("2026-05-17T13:20:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("3e91a843-a361-4838-8d37-a7c7df5d6dad"),
  PurchaseReceiptID: UUID("3e91a843-a361-4838-8d37-a7c7df5d6dad"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-05-0010",
  Quantity: 34,
  UnitPrice: 506.38,
  TotalAmount: 17216.92,
  PurchasedAt: ISODate("2026-05-16T12:15:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("7eacdc85-8d1e-4012-889c-e64e076d9245"),
  PurchaseReceiptID: UUID("7eacdc85-8d1e-4012-889c-e64e076d9245"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "НАКЛ-2026-05-0011",
  Quantity: 49,
  UnitPrice: 1886.18,
  TotalAmount: 92422.82,
  PurchasedAt: ISODate("2026-05-19T11:20:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("3746832e-664c-4fd6-9398-0b4568e899bf"),
  PurchaseReceiptID: UUID("3746832e-664c-4fd6-9398-0b4568e899bf"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "ЗКП-2026-05-0012",
  Quantity: 50,
  UnitPrice: 671.39,
  TotalAmount: 33569.50,
  PurchasedAt: ISODate("2026-05-21T17:40:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("bd72aeb4-7aea-4f34-8940-78dc8882186a"),
  PurchaseReceiptID: UUID("bd72aeb4-7aea-4f34-8940-78dc8882186a"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "УПД-2026-05-0013",
  Quantity: 60,
  UnitPrice: 196.52,
  TotalAmount: 11791.20,
  PurchasedAt: ISODate("2026-05-26T11:50:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("6760e292-07d5-4ae4-97c3-ed6bd55598b0"),
  PurchaseReceiptID: UUID("6760e292-07d5-4ae4-97c3-ed6bd55598b0"),
  SupplierID: UUID("5a155956-0499-49a1-83d4-b647bedcfe8a"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "НАКЛ-2026-05-0014",
  Quantity: 13,
  UnitPrice: 312.21,
  TotalAmount: 4058.73,
  PurchasedAt: ISODate("2026-05-26T14:50:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("f205786e-161d-457a-b32d-7cd829bed542"),
  PurchaseReceiptID: UUID("f205786e-161d-457a-b32d-7cd829bed542"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  WarehouseID: UUID("22c9686f-0a0f-4684-96f6-bc2faa92ec48"),
  DocumentNumber: "ЗКП-2026-05-0015",
  Quantity: 61,
  UnitPrice: 1351.42,
  TotalAmount: 82436.62,
  PurchasedAt: ISODate("2026-05-27T08:45:00"),
  Comment: "Приемка товара для торгового зала"
},
{
  _id: UUID("50a14747-d0fb-4677-b0c3-112116d28f00"),
  PurchaseReceiptID: UUID("50a14747-d0fb-4677-b0c3-112116d28f00"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-05-0016",
  Quantity: 20,
  UnitPrice: 2324.72,
  TotalAmount: 46494.40,
  PurchasedAt: ISODate("2026-05-31T09:50:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("43a95a05-da9b-4734-aba5-075d3ffb44b4"),
  PurchaseReceiptID: UUID("43a95a05-da9b-4734-aba5-075d3ffb44b4"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "УПД-2026-06-0001",
  Quantity: 27,
  UnitPrice: 2099.84,
  TotalAmount: 56695.68,
  PurchasedAt: ISODate("2026-06-01T12:00:00"),
  Comment: "Плановая поставка по графику закупок"
},
{
  _id: UUID("b8d4d612-08b4-4d93-94f6-9f6e195d7bbb"),
  PurchaseReceiptID: UUID("b8d4d612-08b4-4d93-94f6-9f6e195d7bbb"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "НАКЛ-2026-06-0002",
  Quantity: 36,
  UnitPrice: 3102.27,
  TotalAmount: 111681.72,
  PurchasedAt: ISODate("2026-06-02T10:45:00"),
  Comment: "Дозаказ после проверки складских остатков"
},
{
  _id: UUID("9da843b0-febb-4447-9593-3f38f49d99fd"),
  PurchaseReceiptID: UUID("9da843b0-febb-4447-9593-3f38f49d99fd"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "ЗКП-2026-06-0003",
  Quantity: 19,
  UnitPrice: 2815.71,
  TotalAmount: 53498.49,
  PurchasedAt: ISODate("2026-06-01T11:40:00"),
  Comment: "Пополнение ходовой позиции"
},
{
  _id: UUID("30724f2e-9fd1-4650-9996-ccac91da44ba"),
  PurchaseReceiptID: UUID("30724f2e-9fd1-4650-9996-ccac91da44ba"),
  SupplierID: UUID("823a1766-4477-40cb-9995-5aa90c8b9637"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  WarehouseID: UUID("9436a683-9fd0-46f8-be35-6bf9c0801daf"),
  DocumentNumber: "УПД-2026-06-0004",
  Quantity: 15,
  UnitPrice: 846.24,
  TotalAmount: 12693.60,
  PurchasedAt: ISODate("2026-06-02T16:20:00"),
  Comment: "Поставка под сезонный спрос"
},
{
  _id: UUID("4d94b38e-bd24-4c41-9c01-d60fa209d1f1"),
  PurchaseReceiptID: UUID("4d94b38e-bd24-4c41-9c01-d60fa209d1f1"),
  SupplierID: UUID("d3a65d77-fa9e-4e06-af04-86b84b59aad3"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  WarehouseID: UUID("98ef1f3f-00ce-437d-b409-7d2c486f6dff"),
  DocumentNumber: "НАКЛ-2026-06-0005",
  Quantity: 42,
  UnitPrice: 1798.80,
  TotalAmount: 75549.60,
  PurchasedAt: ISODate("2026-06-05T08:10:00"),
  Comment: "Плановая поставка по графику закупок"
}
];
database.getCollection("purchase-receipts").insertMany(purchaseReceipts);

const orders = [
{
  _id: UUID("c72b436e-c2b3-4f86-8a13-74d6456d4d32"),
  OrderID: UUID("c72b436e-c2b3-4f86-8a13-74d6456d4d32"),
  CustomerID: UUID("729300a2-905b-4ad9-a9c6-746bca2f1cbd"),
  OrderDate: ISODate("2026-02-02T10:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202602-10000",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Молодежная, д. 17, кв. 9",
  OrderTotal: 7950.00
},
{
  _id: UUID("bc9753ed-d7a1-4cb7-adf5-d2adc372a80c"),
  OrderID: UUID("bc9753ed-d7a1-4cb7-adf5-d2adc372a80c"),
  CustomerID: UUID("b6b17c36-ef12-47a4-a5a1-0eb13087a2fd"),
  OrderDate: ISODate("2026-02-04T16:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202602-10001",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 6050.00
},
{
  _id: UUID("b6bd15f4-30ae-4185-a43b-44deca17d1f3"),
  OrderID: UUID("b6bd15f4-30ae-4185-a43b-44deca17d1f3"),
  CustomerID: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  OrderDate: ISODate("2026-02-02T16:20:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202602-10002",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 28, кв. 20",
  OrderTotal: 2980.00
},
{
  _id: UUID("2dff08be-2787-4083-851e-8c8cbd891f38"),
  OrderID: UUID("2dff08be-2787-4083-851e-8c8cbd891f38"),
  CustomerID: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  OrderDate: ISODate("2026-02-05T13:00:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202602-10003",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 38, кв. 30",
  OrderTotal: 3170.00
},
{
  _id: UUID("0b43d5fa-0d08-4147-b1b1-d64711cd3b77"),
  OrderID: UUID("0b43d5fa-0d08-4147-b1b1-d64711cd3b77"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-02-07T16:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202602-10004",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 29, кв. 21",
  OrderTotal: 5980.00
},
{
  _id: UUID("d6f1db1b-aa70-47e1-a60e-be11699a2efc"),
  OrderID: UUID("d6f1db1b-aa70-47e1-a60e-be11699a2efc"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-02-11T10:45:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202602-10005",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 2190.00
},
{
  _id: UUID("32187d38-d1d6-447e-958d-b3a2fbc45540"),
  OrderID: UUID("32187d38-d1d6-447e-958d-b3a2fbc45540"),
  CustomerID: UUID("d1e8f50e-45a6-4110-b316-e70755da1a56"),
  OrderDate: ISODate("2026-02-12T10:15:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202602-10006",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 32, кв. 24",
  OrderTotal: 1360.00
},
{
  _id: UUID("6513ee1d-f177-4e61-aaf9-845041207c7c"),
  OrderID: UUID("6513ee1d-f177-4e61-aaf9-845041207c7c"),
  CustomerID: UUID("8df26cdf-c574-4dc9-b646-35d2a870f821"),
  OrderDate: ISODate("2026-02-14T19:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202602-10007",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 23, кв. 15",
  OrderTotal: 1580.00
},
{
  _id: UUID("564deb05-5823-41e8-9c30-47f3c53ce5ea"),
  OrderID: UUID("564deb05-5823-41e8-9c30-47f3c53ce5ea"),
  CustomerID: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  OrderDate: ISODate("2026-02-11T10:50:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202602-10008",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 28, кв. 20",
  OrderTotal: 2700.00
},
{
  _id: UUID("2c055f2f-730d-4c1d-887e-38e0737c1aa9"),
  OrderID: UUID("2c055f2f-730d-4c1d-887e-38e0737c1aa9"),
  CustomerID: UUID("878799a7-eae6-4ce8-9e91-2f112505d732"),
  OrderDate: ISODate("2026-02-13T09:50:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202602-10009",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 2520.00
},
{
  _id: UUID("eb2ac074-b869-45ba-9f0f-a807f318b425"),
  OrderID: UUID("eb2ac074-b869-45ba-9f0f-a807f318b425"),
  CustomerID: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  OrderDate: ISODate("2026-02-17T12:45:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202602-10010",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Курчатова, д. 35, кв. 27",
  OrderTotal: 1180.00
},
{
  _id: UUID("3aac6bbb-afa1-455b-919b-c5b520646f37"),
  OrderID: UUID("3aac6bbb-afa1-455b-919b-c5b520646f37"),
  CustomerID: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  OrderDate: ISODate("2026-02-17T17:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202602-10011",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 6410.00
},
{
  _id: UUID("58b47ff6-48d5-438a-9572-21cba51e3f13"),
  OrderID: UUID("58b47ff6-48d5-438a-9572-21cba51e3f13"),
  CustomerID: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  OrderDate: ISODate("2026-02-18T17:50:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202602-10012",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 33, кв. 25",
  OrderTotal: 680.00
},
{
  _id: UUID("28dcd142-cb7a-4f14-a093-a32d247ebb5e"),
  OrderID: UUID("28dcd142-cb7a-4f14-a093-a32d247ebb5e"),
  CustomerID: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  OrderDate: ISODate("2026-02-23T18:30:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202602-10013",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 5490.00
},
{
  _id: UUID("a34cc425-0a71-4ef1-8a95-41071c6ad8e6"),
  OrderID: UUID("a34cc425-0a71-4ef1-8a95-41071c6ad8e6"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  OrderDate: ISODate("2026-02-24T17:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202602-10014",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 18, кв. 10",
  OrderTotal: 2200.00
},
{
  _id: UUID("d17cbddd-bf8e-4c0a-90be-18197c1e34b8"),
  OrderID: UUID("d17cbddd-bf8e-4c0a-90be-18197c1e34b8"),
  CustomerID: UUID("08946f79-71e0-41d9-8c53-31689c3abfbd"),
  OrderDate: ISODate("2026-02-25T19:10:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202602-10015",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Весенняя, д. 21, кв. 13",
  OrderTotal: 4380.00
},
{
  _id: UUID("e9ff6193-ef1c-4750-bc94-564116b714f1"),
  OrderID: UUID("e9ff6193-ef1c-4750-bc94-564116b714f1"),
  CustomerID: UUID("14544af5-45ca-4e3b-a9cd-fd72cf09b85f"),
  OrderDate: ISODate("2026-02-24T16:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202602-10016",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Советская, д. 26, кв. 18",
  OrderTotal: 5200.00
},
{
  _id: UUID("72538ed9-3b15-48f9-bb3f-3418a451bd4f"),
  OrderID: UUID("72538ed9-3b15-48f9-bb3f-3418a451bd4f"),
  CustomerID: UUID("2375bfb0-73b6-4db8-a95d-a95d296e529a"),
  OrderDate: ISODate("2026-02-26T11:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202602-10017",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 3540.00
},
{
  _id: UUID("6bafebe0-89d7-4c1a-9626-4ad1bac4f223"),
  OrderID: UUID("6bafebe0-89d7-4c1a-9626-4ad1bac4f223"),
  CustomerID: UUID("01bc485c-970b-4b21-a952-eb7e2ef36cc7"),
  OrderDate: ISODate("2026-03-03T12:15:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202603-10018",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 17160.00
},
{
  _id: UUID("970fa3b6-36f2-436c-82ae-a0c532775b32"),
  OrderID: UUID("970fa3b6-36f2-436c-82ae-a0c532775b32"),
  CustomerID: UUID("2375bfb0-73b6-4db8-a95d-a95d296e529a"),
  OrderDate: ISODate("2026-03-03T18:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202603-10019",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 7350.00
},
{
  _id: UUID("6b45579a-e401-4861-a37f-84d1b1b3896f"),
  OrderID: UUID("6b45579a-e401-4861-a37f-84d1b1b3896f"),
  CustomerID: UUID("78a6fb3e-2503-4d1b-bff2-34a42dae1c38"),
  OrderDate: ISODate("2026-03-02T17:30:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202603-10020",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 19, кв. 11",
  OrderTotal: 2190.00
},
{
  _id: UUID("8e803803-fa04-409e-8ec4-478a0d11e68e"),
  OrderID: UUID("8e803803-fa04-409e-8ec4-478a0d11e68e"),
  CustomerID: UUID("66d35801-d16c-495b-9312-a1e3a446fe92"),
  OrderDate: ISODate("2026-03-03T19:50:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202603-10021",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Молодежная, д. 37, кв. 29",
  OrderTotal: 25420.00
},
{
  _id: UUID("66b29d47-0c78-4a43-8741-fc0eaeeb546a"),
  OrderID: UUID("66b29d47-0c78-4a43-8741-fc0eaeeb546a"),
  CustomerID: UUID("0c196312-145a-4819-996d-d1185167155a"),
  OrderDate: ISODate("2026-03-06T10:15:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202603-10022",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 1990.00
},
{
  _id: UUID("912dae00-626e-468e-b0ee-19bc6e33bdf6"),
  OrderID: UUID("912dae00-626e-468e-b0ee-19bc6e33bdf6"),
  CustomerID: UUID("567171a0-5ff2-4e97-9fde-2a1202eb47d5"),
  OrderDate: ISODate("2026-03-05T16:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10023",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 22, кв. 14",
  OrderTotal: 3790.00
},
{
  _id: UUID("e47c3d88-a445-4bae-8c91-9f7357db7984"),
  OrderID: UUID("e47c3d88-a445-4bae-8c91-9f7357db7984"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-03-04T12:15:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202603-10024",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Энтузиастов, д. 30, кв. 22",
  OrderTotal: 3490.00
},
{
  _id: UUID("2841ba18-4f7b-48ef-a6ab-a8a5a60f6fd2"),
  OrderID: UUID("2841ba18-4f7b-48ef-a6ab-a8a5a60f6fd2"),
  CustomerID: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  OrderDate: ISODate("2026-03-06T11:45:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "SHOP-202603-10025",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 5490.00
},
{
  _id: UUID("36e325d2-a436-4bfa-8615-e49511a52b6d"),
  OrderID: UUID("36e325d2-a436-4bfa-8615-e49511a52b6d"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-03-06T15:50:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202603-10026",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Советская, д. 36, кв. 28",
  OrderTotal: 7650.00
},
{
  _id: UUID("81048032-32f1-4c29-b2e8-baec46d6f5b4"),
  OrderID: UUID("81048032-32f1-4c29-b2e8-baec46d6f5b4"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-03-06T09:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10027",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Энтузиастов, д. 30, кв. 22",
  OrderTotal: 5790.00
},
{
  _id: UUID("88d6b780-a3ae-45a2-ab1a-748c98387cd4"),
  OrderID: UUID("88d6b780-a3ae-45a2-ab1a-748c98387cd4"),
  CustomerID: UUID("729300a2-905b-4ad9-a9c6-746bca2f1cbd"),
  OrderDate: ISODate("2026-03-08T16:10:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10028",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Молодежная, д. 17, кв. 9",
  OrderTotal: 6960.00
},
{
  _id: UUID("ab21bad6-1ab1-4942-8f0f-c6285c6152ea"),
  OrderID: UUID("ab21bad6-1ab1-4942-8f0f-c6285c6152ea"),
  CustomerID: UUID("61979607-c114-4795-88c5-3d1d4de0dc67"),
  OrderDate: ISODate("2026-03-11T12:40:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202603-10029",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Гагарина, д. 34, кв. 26",
  OrderTotal: 17090.00
},
{
  _id: UUID("c74623a9-8b6e-446d-a52a-9ec6dc82bccc"),
  OrderID: UUID("c74623a9-8b6e-446d-a52a-9ec6dc82bccc"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-03-11T15:45:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202603-10030",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 790.00
},
{
  _id: UUID("a822c162-b7e7-4980-8930-e8c2cc9053ad"),
  OrderID: UUID("a822c162-b7e7-4980-8930-e8c2cc9053ad"),
  CustomerID: UUID("0c196312-145a-4819-996d-d1185167155a"),
  OrderDate: ISODate("2026-03-09T11:00:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202603-10031",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Гагарина, д. 24, кв. 16",
  OrderTotal: 4330.00
},
{
  _id: UUID("0ac768f4-a4cc-4233-b4fd-52de91eae985"),
  OrderID: UUID("0ac768f4-a4cc-4233-b4fd-52de91eae985"),
  CustomerID: UUID("567171a0-5ff2-4e97-9fde-2a1202eb47d5"),
  OrderDate: ISODate("2026-03-14T16:10:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10032",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 22, кв. 14",
  OrderTotal: 1100.00
},
{
  _id: UUID("cb63c10a-fd66-4b0f-a3a5-e993fae5564a"),
  OrderID: UUID("cb63c10a-fd66-4b0f-a3a5-e993fae5564a"),
  CustomerID: UUID("2980541d-1381-4182-a6de-cf0279954255"),
  OrderDate: ISODate("2026-03-13T17:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202603-10033",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 1990.00
},
{
  _id: UUID("00636bad-9e10-43dd-96ba-3e901211d0a9"),
  OrderID: UUID("00636bad-9e10-43dd-96ba-3e901211d0a9"),
  CustomerID: UUID("78a6fb3e-2503-4d1b-bff2-34a42dae1c38"),
  OrderDate: ISODate("2026-03-14T12:20:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202603-10034",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 790.00
},
{
  _id: UUID("a8679c74-218e-427d-a93e-d10a329600ec"),
  OrderID: UUID("a8679c74-218e-427d-a93e-d10a329600ec"),
  CustomerID: UUID("cb1f1047-66cc-4488-baea-843708ad9241"),
  OrderDate: ISODate("2026-03-15T15:20:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10035",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Курчатова, д. 25, кв. 17",
  OrderTotal: 3830.00
},
{
  _id: UUID("55bf3a1f-ee4e-45f3-a0a7-5f0bd066c7ac"),
  OrderID: UUID("55bf3a1f-ee4e-45f3-a0a7-5f0bd066c7ac"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-03-16T14:50:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10036",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 29, кв. 21",
  OrderTotal: 6190.00
},
{
  _id: UUID("fa866c3c-9751-410f-9a7a-180d4edc41fe"),
  OrderID: UUID("fa866c3c-9751-410f-9a7a-180d4edc41fe"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-03-15T09:20:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202603-10037",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 13960.00
},
{
  _id: UUID("8c646b55-8a91-4dda-857c-533514ef551b"),
  OrderID: UUID("8c646b55-8a91-4dda-857c-533514ef551b"),
  CustomerID: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  OrderDate: ISODate("2026-03-16T12:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10038",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 38, кв. 30",
  OrderTotal: 2770.00
},
{
  _id: UUID("92b833a7-d54b-49e9-9213-98d327d54f09"),
  OrderID: UUID("92b833a7-d54b-49e9-9213-98d327d54f09"),
  CustomerID: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  OrderDate: ISODate("2026-03-20T09:30:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "WEB-202603-10039",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 38, кв. 30",
  OrderTotal: 1470.00
},
{
  _id: UUID("31456baa-8591-4f91-a9b0-eaf7e1f7377c"),
  OrderID: UUID("31456baa-8591-4f91-a9b0-eaf7e1f7377c"),
  CustomerID: UUID("08946f79-71e0-41d9-8c53-31689c3abfbd"),
  OrderDate: ISODate("2026-03-21T11:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202603-10040",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 1970.00
},
{
  _id: UUID("35421669-9eed-48f1-98b7-1ad8fbf184dc"),
  OrderID: UUID("35421669-9eed-48f1-98b7-1ad8fbf184dc"),
  CustomerID: UUID("14544af5-45ca-4e3b-a9cd-fd72cf09b85f"),
  OrderDate: ISODate("2026-03-18T15:30:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202603-10041",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Советская, д. 26, кв. 18",
  OrderTotal: 680.00
},
{
  _id: UUID("271e9bac-d5d3-4779-9560-560cf5b0c5cf"),
  OrderID: UUID("271e9bac-d5d3-4779-9560-560cf5b0c5cf"),
  CustomerID: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  OrderDate: ISODate("2026-03-22T12:20:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202603-10042",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 13, кв. 5",
  OrderTotal: 3110.00
},
{
  _id: UUID("a9933afb-b82c-430f-9c94-ff4ef086fa6b"),
  OrderID: UUID("a9933afb-b82c-430f-9c94-ff4ef086fa6b"),
  CustomerID: UUID("51514043-16b7-46e9-97e9-753a5a62af9a"),
  OrderDate: ISODate("2026-03-23T16:10:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202603-10043",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 5490.00
},
{
  _id: UUID("71e1feab-c186-429f-ae33-7b273337afd3"),
  OrderID: UUID("71e1feab-c186-429f-ae33-7b273337afd3"),
  CustomerID: UUID("d1e8f50e-45a6-4110-b316-e70755da1a56"),
  OrderDate: ISODate("2026-03-22T17:40:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202603-10044",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 32, кв. 24",
  OrderTotal: 920.00
},
{
  _id: UUID("7b947164-1991-4eda-a8d7-fe4edfce80c1"),
  OrderID: UUID("7b947164-1991-4eda-a8d7-fe4edfce80c1"),
  CustomerID: UUID("2980541d-1381-4182-a6de-cf0279954255"),
  OrderDate: ISODate("2026-03-23T10:45:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "SHOP-202603-10045",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 6530.00
},
{
  _id: UUID("3903bc70-dbf2-4e92-9d16-5c48263da70e"),
  OrderID: UUID("3903bc70-dbf2-4e92-9d16-5c48263da70e"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-03-22T15:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10046",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Энтузиастов, д. 30, кв. 22",
  OrderTotal: 4410.00
},
{
  _id: UUID("e941b9d5-9825-4a6d-b804-29a7e67a2a6e"),
  OrderID: UUID("e941b9d5-9825-4a6d-b804-29a7e67a2a6e"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-03-26T10:20:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10047",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 29, кв. 21",
  OrderTotal: 5300.00
},
{
  _id: UUID("80f935ef-6f63-4dc6-8526-f61e14bef793"),
  OrderID: UUID("80f935ef-6f63-4dc6-8526-f61e14bef793"),
  CustomerID: UUID("b6b17c36-ef12-47a4-a5a1-0eb13087a2fd"),
  OrderDate: ISODate("2026-03-26T17:50:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "SHOP-202603-10048",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 310.00
},
{
  _id: UUID("a43dd195-64f1-4223-a728-786250d8d730"),
  OrderID: UUID("a43dd195-64f1-4223-a728-786250d8d730"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-03-24T10:15:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202603-10049",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 680.00
},
{
  _id: UUID("9d29d03a-a9d9-4e02-86d5-e8cc2639bcae"),
  OrderID: UUID("9d29d03a-a9d9-4e02-86d5-e8cc2639bcae"),
  CustomerID: UUID("2980541d-1381-4182-a6de-cf0279954255"),
  OrderDate: ISODate("2026-03-27T17:40:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202603-10050",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 12, кв. 4",
  OrderTotal: 2960.00
},
{
  _id: UUID("47d3fce7-f86d-43ed-b35e-64705539cc7f"),
  OrderID: UUID("47d3fce7-f86d-43ed-b35e-64705539cc7f"),
  CustomerID: UUID("08946f79-71e0-41d9-8c53-31689c3abfbd"),
  OrderDate: ISODate("2026-03-26T17:45:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "WEB-202603-10051",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Весенняя, д. 21, кв. 13",
  OrderTotal: 5130.00
},
{
  _id: UUID("ac462906-e1b7-446a-a52d-c613f2acaf9d"),
  OrderID: UUID("ac462906-e1b7-446a-a52d-c613f2acaf9d"),
  CustomerID: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  OrderDate: ISODate("2026-03-26T17:40:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10052",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Курчатова, д. 35, кв. 27",
  OrderTotal: 3760.00
},
{
  _id: UUID("be515ce6-d382-4b14-9be6-14ad18e022d3"),
  OrderID: UUID("be515ce6-d382-4b14-9be6-14ad18e022d3"),
  CustomerID: UUID("8df26cdf-c574-4dc9-b646-35d2a870f821"),
  OrderDate: ISODate("2026-03-31T11:50:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202603-10053",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 2650.00
},
{
  _id: UUID("9a72eb0b-7496-4071-8e6d-d1ea6ad86356"),
  OrderID: UUID("9a72eb0b-7496-4071-8e6d-d1ea6ad86356"),
  CustomerID: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  OrderDate: ISODate("2026-03-30T17:40:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202603-10054",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 38, кв. 30",
  OrderTotal: 10140.00
},
{
  _id: UUID("1fffe321-44c7-4ffd-bfb3-86b0f9e740b4"),
  OrderID: UUID("1fffe321-44c7-4ffd-bfb3-86b0f9e740b4"),
  CustomerID: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  OrderDate: ISODate("2026-04-01T17:30:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202604-10055",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 33, кв. 25",
  OrderTotal: 560.00
},
{
  _id: UUID("e5bd84dc-844e-47ec-a2ea-2e15cc5a45f5"),
  OrderID: UUID("e5bd84dc-844e-47ec-a2ea-2e15cc5a45f5"),
  CustomerID: UUID("61979607-c114-4795-88c5-3d1d4de0dc67"),
  OrderDate: ISODate("2026-04-04T16:30:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "SHOP-202604-10056",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 4780.00
},
{
  _id: UUID("28a3d54e-c2f3-4fca-a63c-3a0f190789ad"),
  OrderID: UUID("28a3d54e-c2f3-4fca-a63c-3a0f190789ad"),
  CustomerID: UUID("01bc485c-970b-4b21-a952-eb7e2ef36cc7"),
  OrderDate: ISODate("2026-04-02T12:20:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202604-10057",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Советская, д. 16, кв. 8",
  OrderTotal: 5880.00
},
{
  _id: UUID("424cc51d-faad-4fd4-8265-c6a7843456a0"),
  OrderID: UUID("424cc51d-faad-4fd4-8265-c6a7843456a0"),
  CustomerID: UUID("276e989d-fc0c-46cd-a554-b483b27971b8"),
  OrderDate: ISODate("2026-04-03T16:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202604-10058",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Весенняя, д. 31, кв. 23",
  OrderTotal: 1840.00
},
{
  _id: UUID("99981bdc-9db6-4c9b-89fe-6bfffa68b110"),
  OrderID: UUID("99981bdc-9db6-4c9b-89fe-6bfffa68b110"),
  CustomerID: UUID("14544af5-45ca-4e3b-a9cd-fd72cf09b85f"),
  OrderDate: ISODate("2026-04-08T13:30:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202604-10059",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 4780.00
},
{
  _id: UUID("abf33c72-cf25-4c77-9efb-0c5837b17514"),
  OrderID: UUID("abf33c72-cf25-4c77-9efb-0c5837b17514"),
  CustomerID: UUID("66d35801-d16c-495b-9312-a1e3a446fe92"),
  OrderDate: ISODate("2026-04-06T14:15:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202604-10060",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Молодежная, д. 37, кв. 29",
  OrderTotal: 2890.00
},
{
  _id: UUID("b24a7205-215b-4c37-8112-d6c6121f62c1"),
  OrderID: UUID("b24a7205-215b-4c37-8112-d6c6121f62c1"),
  CustomerID: UUID("d1e8f50e-45a6-4110-b316-e70755da1a56"),
  OrderDate: ISODate("2026-04-06T16:30:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202604-10061",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 32, кв. 24",
  OrderTotal: 19150.00
},
{
  _id: UUID("846e18fc-14f1-428a-b32a-ec486c2a7623"),
  OrderID: UUID("846e18fc-14f1-428a-b32a-ec486c2a7623"),
  CustomerID: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  OrderDate: ISODate("2026-04-09T14:20:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202604-10062",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Курчатова, д. 35, кв. 27",
  OrderTotal: 3490.00
},
{
  _id: UUID("9bbb166d-4044-41e6-bcbe-30572cd2f91f"),
  OrderID: UUID("9bbb166d-4044-41e6-bcbe-30572cd2f91f"),
  CustomerID: UUID("d1e8f50e-45a6-4110-b316-e70755da1a56"),
  OrderDate: ISODate("2026-04-12T13:50:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202604-10063",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 3740.00
},
{
  _id: UUID("60c49087-93b1-4b0d-90de-de296882b589"),
  OrderID: UUID("60c49087-93b1-4b0d-90de-de296882b589"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-04-12T16:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202604-10064",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 29, кв. 21",
  OrderTotal: 5160.00
},
{
  _id: UUID("f69ab3da-36fe-4738-847d-de5a09717b42"),
  OrderID: UUID("f69ab3da-36fe-4738-847d-de5a09717b42"),
  CustomerID: UUID("08946f79-71e0-41d9-8c53-31689c3abfbd"),
  OrderDate: ISODate("2026-04-13T16:10:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202604-10065",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 9200.00
},
{
  _id: UUID("538114f6-b562-48c0-b2ce-b9c30a5ea56d"),
  OrderID: UUID("538114f6-b562-48c0-b2ce-b9c30a5ea56d"),
  CustomerID: UUID("ea1bb343-ca15-4d4c-9f6d-fa1ec33338f0"),
  OrderDate: ISODate("2026-04-14T14:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202604-10066",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 9660.00
},
{
  _id: UUID("08d675c8-025a-4cfa-accf-7c858fcfcbf7"),
  OrderID: UUID("08d675c8-025a-4cfa-accf-7c858fcfcbf7"),
  CustomerID: UUID("ea1bb343-ca15-4d4c-9f6d-fa1ec33338f0"),
  OrderDate: ISODate("2026-04-15T19:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202604-10067",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Молодежная, д. 27, кв. 19",
  OrderTotal: 9140.00
},
{
  _id: UUID("61138ed6-1b35-4334-9635-08f45361576d"),
  OrderID: UUID("61138ed6-1b35-4334-9635-08f45361576d"),
  CustomerID: UUID("cb1f1047-66cc-4488-baea-843708ad9241"),
  OrderDate: ISODate("2026-04-19T11:40:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "SHOP-202604-10068",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 2370.00
},
{
  _id: UUID("638ada9e-002f-4b95-80ae-b2b4d1358603"),
  OrderID: UUID("638ada9e-002f-4b95-80ae-b2b4d1358603"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-04-19T13:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202604-10069",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 4470.00
},
{
  _id: UUID("14e75d90-fc01-4034-8e36-4ad933f0fc72"),
  OrderID: UUID("14e75d90-fc01-4034-8e36-4ad933f0fc72"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-04-19T16:20:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202604-10070",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Советская, д. 36, кв. 28",
  OrderTotal: 8580.00
},
{
  _id: UUID("4da1c620-42bd-4297-b1b5-c2969612e53a"),
  OrderID: UUID("4da1c620-42bd-4297-b1b5-c2969612e53a"),
  CustomerID: UUID("51514043-16b7-46e9-97e9-753a5a62af9a"),
  OrderDate: ISODate("2026-04-21T11:20:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202604-10071",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 4120.00
},
{
  _id: UUID("7c15634f-62ce-4551-baef-39ab70749110"),
  OrderID: UUID("7c15634f-62ce-4551-baef-39ab70749110"),
  CustomerID: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  OrderDate: ISODate("2026-04-19T14:50:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202604-10072",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 33, кв. 25",
  OrderTotal: 3200.00
},
{
  _id: UUID("fccb1c9d-3d37-4c30-a8b6-f220860e5188"),
  OrderID: UUID("fccb1c9d-3d37-4c30-a8b6-f220860e5188"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-04-23T14:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202604-10073",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 5390.00
},
{
  _id: UUID("cb627157-3053-4aa0-ac27-11570229c0f1"),
  OrderID: UUID("cb627157-3053-4aa0-ac27-11570229c0f1"),
  CustomerID: UUID("567171a0-5ff2-4e97-9fde-2a1202eb47d5"),
  OrderDate: ISODate("2026-04-23T12:50:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202604-10074",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 22, кв. 14",
  OrderTotal: 4980.00
},
{
  _id: UUID("e747011f-f39d-4b1e-b4a0-03391f233a3c"),
  OrderID: UUID("e747011f-f39d-4b1e-b4a0-03391f233a3c"),
  CustomerID: UUID("2980541d-1381-4182-a6de-cf0279954255"),
  OrderDate: ISODate("2026-04-26T17:15:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202604-10075",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 8890.00
},
{
  _id: UUID("49957640-6d54-4c2a-9359-d914fc7e8bd9"),
  OrderID: UUID("49957640-6d54-4c2a-9359-d914fc7e8bd9"),
  CustomerID: UUID("2375bfb0-73b6-4db8-a95d-a95d296e529a"),
  OrderDate: ISODate("2026-04-26T16:30:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202604-10076",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Энтузиастов, д. 10, кв. 2",
  OrderTotal: 2650.00
},
{
  _id: UUID("2470a601-7ad3-478b-be5a-2d380c3aebd3"),
  OrderID: UUID("2470a601-7ad3-478b-be5a-2d380c3aebd3"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-04-27T17:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202604-10077",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 9, кв. 1",
  OrderTotal: 680.00
},
{
  _id: UUID("127835ea-5a4d-40a8-8150-485b5774ef6b"),
  OrderID: UUID("127835ea-5a4d-40a8-8150-485b5774ef6b"),
  CustomerID: UUID("ea1bb343-ca15-4d4c-9f6d-fa1ec33338f0"),
  OrderDate: ISODate("2026-04-30T18:15:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202604-10078",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 19130.00
},
{
  _id: UUID("c650bda1-1db2-45e6-a27e-ee330fdbfc1f"),
  OrderID: UUID("c650bda1-1db2-45e6-a27e-ee330fdbfc1f"),
  CustomerID: UUID("2375bfb0-73b6-4db8-a95d-a95d296e529a"),
  OrderDate: ISODate("2026-05-01T14:40:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202605-10079",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 2040.00
},
{
  _id: UUID("98c15f34-4bd7-4f2e-b365-74d8ee616536"),
  OrderID: UUID("98c15f34-4bd7-4f2e-b365-74d8ee616536"),
  CustomerID: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  OrderDate: ISODate("2026-05-01T12:20:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202605-10080",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 1370.00
},
{
  _id: UUID("98e31411-8ee9-4384-927f-41329c9ac598"),
  OrderID: UUID("98e31411-8ee9-4384-927f-41329c9ac598"),
  CustomerID: UUID("51514043-16b7-46e9-97e9-753a5a62af9a"),
  OrderDate: ISODate("2026-05-01T09:20:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202605-10081",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 14470.00
},
{
  _id: UUID("5e3f8a27-f6b1-41ae-84c9-4cdc27cccc82"),
  OrderID: UUID("5e3f8a27-f6b1-41ae-84c9-4cdc27cccc82"),
  CustomerID: UUID("8df26cdf-c574-4dc9-b646-35d2a870f821"),
  OrderDate: ISODate("2026-05-05T14:00:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202605-10082",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 4300.00
},
{
  _id: UUID("30852555-56fb-43f6-86f1-6d7392afab75"),
  OrderID: UUID("30852555-56fb-43f6-86f1-6d7392afab75"),
  CustomerID: UUID("fa1da79d-bcb9-4d0f-91d2-e9ba58cc06c4"),
  OrderDate: ISODate("2026-05-01T12:20:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202605-10083",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 38, кв. 30",
  OrderTotal: 2870.00
},
{
  _id: UUID("03bb4049-d609-4add-8d12-a16a76b1fc1f"),
  OrderID: UUID("03bb4049-d609-4add-8d12-a16a76b1fc1f"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-05-02T11:50:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202605-10084",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 8440.00
},
{
  _id: UUID("50f30f65-d066-45df-a3ca-0b3c39642d59"),
  OrderID: UUID("50f30f65-d066-45df-a3ca-0b3c39642d59"),
  CustomerID: UUID("567171a0-5ff2-4e97-9fde-2a1202eb47d5"),
  OrderDate: ISODate("2026-05-03T16:10:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202605-10085",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 7300.00
},
{
  _id: UUID("7a7dace2-ae08-4599-bf64-bcec020cb0cf"),
  OrderID: UUID("7a7dace2-ae08-4599-bf64-bcec020cb0cf"),
  CustomerID: UUID("cb1f1047-66cc-4488-baea-843708ad9241"),
  OrderDate: ISODate("2026-05-05T17:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202605-10086",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Курчатова, д. 25, кв. 17",
  OrderTotal: 3980.00
},
{
  _id: UUID("c69bc1ef-8108-4fc7-9bad-ee02d468cfb8"),
  OrderID: UUID("c69bc1ef-8108-4fc7-9bad-ee02d468cfb8"),
  CustomerID: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  OrderDate: ISODate("2026-05-07T10:10:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202605-10087",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 28, кв. 20",
  OrderTotal: 6900.00
},
{
  _id: UUID("528895c5-8146-43fa-8a3b-01b565203345"),
  OrderID: UUID("528895c5-8146-43fa-8a3b-01b565203345"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-05-05T11:50:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202605-10088",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 8580.00
},
{
  _id: UUID("f63ea85e-6d63-470a-aa54-62ec908e0044"),
  OrderID: UUID("f63ea85e-6d63-470a-aa54-62ec908e0044"),
  CustomerID: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  OrderDate: ISODate("2026-05-09T18:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202605-10089",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 3970.00
},
{
  _id: UUID("5e80807e-e418-42cb-9b97-0c8bad5f6d00"),
  OrderID: UUID("5e80807e-e418-42cb-9b97-0c8bad5f6d00"),
  CustomerID: UUID("cb1f1047-66cc-4488-baea-843708ad9241"),
  OrderDate: ISODate("2026-05-10T11:00:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "SHOP-202605-10090",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 15700.00
},
{
  _id: UUID("7e583da2-488e-4b0c-95fd-4cea3ffe493d"),
  OrderID: UUID("7e583da2-488e-4b0c-95fd-4cea3ffe493d"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-05-11T18:00:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202605-10091",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 3790.00
},
{
  _id: UUID("747b7f77-10ec-4a1d-b43b-5faf204de8c4"),
  OrderID: UUID("747b7f77-10ec-4a1d-b43b-5faf204de8c4"),
  CustomerID: UUID("3f90211f-174d-437a-8035-3930224097e2"),
  OrderDate: ISODate("2026-05-08T10:20:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202605-10092",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 7550.00
},
{
  _id: UUID("2c55bd53-aa8b-4882-a353-b423644c0169"),
  OrderID: UUID("2c55bd53-aa8b-4882-a353-b423644c0169"),
  CustomerID: UUID("14544af5-45ca-4e3b-a9cd-fd72cf09b85f"),
  OrderDate: ISODate("2026-05-09T13:50:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202605-10093",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 2650.00
},
{
  _id: UUID("07e52468-31cb-4daf-8789-79d3cfd06ad6"),
  OrderID: UUID("07e52468-31cb-4daf-8789-79d3cfd06ad6"),
  CustomerID: UUID("08946f79-71e0-41d9-8c53-31689c3abfbd"),
  OrderDate: ISODate("2026-05-10T12:50:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "WEB-202605-10094",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Весенняя, д. 21, кв. 13",
  OrderTotal: 5390.00
},
{
  _id: UUID("f7155c81-6cec-4335-b16a-cda6cdcd4011"),
  OrderID: UUID("f7155c81-6cec-4335-b16a-cda6cdcd4011"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  OrderDate: ISODate("2026-05-09T10:00:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202605-10095",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 18, кв. 10",
  OrderTotal: 1860.00
},
{
  _id: UUID("ac0e311f-40c3-4465-ba3b-f034558c4b80"),
  OrderID: UUID("ac0e311f-40c3-4465-ba3b-f034558c4b80"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-05-10T18:15:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202605-10096",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 18270.00
},
{
  _id: UUID("eb11132c-bea5-487c-96e4-6abd8c571b9a"),
  OrderID: UUID("eb11132c-bea5-487c-96e4-6abd8c571b9a"),
  CustomerID: UUID("276e989d-fc0c-46cd-a554-b483b27971b8"),
  OrderDate: ISODate("2026-05-12T09:15:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202605-10097",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Весенняя, д. 31, кв. 23",
  OrderTotal: 4430.00
},
{
  _id: UUID("c7df4f66-bc69-46a4-b1bc-9fa7b15d1430"),
  OrderID: UUID("c7df4f66-bc69-46a4-b1bc-9fa7b15d1430"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-05-12T11:15:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202605-10098",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 3180.00
},
{
  _id: UUID("d55b4f75-7289-45ad-b94e-b1679b0eacc6"),
  OrderID: UUID("d55b4f75-7289-45ad-b94e-b1679b0eacc6"),
  CustomerID: UUID("8df26cdf-c574-4dc9-b646-35d2a870f821"),
  OrderDate: ISODate("2026-05-14T11:40:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "WEB-202605-10099",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 23, кв. 15",
  OrderTotal: 1410.00
},
{
  _id: UUID("f6cfb14d-2d62-4d8d-84b6-993f92425cbd"),
  OrderID: UUID("f6cfb14d-2d62-4d8d-84b6-993f92425cbd"),
  CustomerID: UUID("61979607-c114-4795-88c5-3d1d4de0dc67"),
  OrderDate: ISODate("2026-05-16T10:10:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202605-10100",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 560.00
},
{
  _id: UUID("594972c3-a9eb-41ae-b0af-6e6af4947af5"),
  OrderID: UUID("594972c3-a9eb-41ae-b0af-6e6af4947af5"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  OrderDate: ISODate("2026-05-13T17:10:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202605-10101",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 6270.00
},
{
  _id: UUID("f32b3c55-544c-49d5-9017-6750aedd3d53"),
  OrderID: UUID("f32b3c55-544c-49d5-9017-6750aedd3d53"),
  CustomerID: UUID("78a6fb3e-2503-4d1b-bff2-34a42dae1c38"),
  OrderDate: ISODate("2026-05-17T18:00:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "SHOP-202605-10102",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 3180.00
},
{
  _id: UUID("5f0aac5f-c981-4d7d-8403-9969ae8481e1"),
  OrderID: UUID("5f0aac5f-c981-4d7d-8403-9969ae8481e1"),
  CustomerID: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  OrderDate: ISODate("2026-05-14T17:15:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202605-10103",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 13, кв. 5",
  OrderTotal: 9590.00
},
{
  _id: UUID("9d43c63e-5feb-4968-8350-7fd4164968b0"),
  OrderID: UUID("9d43c63e-5feb-4968-8350-7fd4164968b0"),
  CustomerID: UUID("01bc485c-970b-4b21-a952-eb7e2ef36cc7"),
  OrderDate: ISODate("2026-05-19T15:45:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202605-10104",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Советская, д. 16, кв. 8",
  OrderTotal: 2150.00
},
{
  _id: UUID("6906e733-9798-4f22-a63c-5ccc0ed3df8c"),
  OrderID: UUID("6906e733-9798-4f22-a63c-5ccc0ed3df8c"),
  CustomerID: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  OrderDate: ISODate("2026-05-20T11:50:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202605-10105",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Курчатова, д. 35, кв. 27",
  OrderTotal: 12290.00
},
{
  _id: UUID("5959c5ba-2c97-4424-8761-a491d99e0363"),
  OrderID: UUID("5959c5ba-2c97-4424-8761-a491d99e0363"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-05-20T15:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202605-10106",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 9, кв. 1",
  OrderTotal: 2950.00
},
{
  _id: UUID("011ab2c6-d1f5-4a38-81a5-59d1c9c0e84a"),
  OrderID: UUID("011ab2c6-d1f5-4a38-81a5-59d1c9c0e84a"),
  CustomerID: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  OrderDate: ISODate("2026-05-17T16:50:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202605-10107",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 13, кв. 5",
  OrderTotal: 9720.00
},
{
  _id: UUID("42dbc97f-004c-4692-8af7-05bd295900d9"),
  OrderID: UUID("42dbc97f-004c-4692-8af7-05bd295900d9"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-05-21T13:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202605-10108",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 29, кв. 21",
  OrderTotal: 680.00
},
{
  _id: UUID("804b749f-b445-4388-af4d-87dc707899f5"),
  OrderID: UUID("804b749f-b445-4388-af4d-87dc707899f5"),
  CustomerID: UUID("3f90211f-174d-437a-8035-3930224097e2"),
  OrderDate: ISODate("2026-05-20T19:20:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202605-10109",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 7580.00
},
{
  _id: UUID("432f499c-296c-4edb-8e81-90f7df22af5f"),
  OrderID: UUID("432f499c-296c-4edb-8e81-90f7df22af5f"),
  CustomerID: UUID("276e989d-fc0c-46cd-a554-b483b27971b8"),
  OrderDate: ISODate("2026-05-20T14:50:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202605-10110",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 11330.00
},
{
  _id: UUID("c807d98f-aa9e-485e-8256-fa92b8eb2a5b"),
  OrderID: UUID("c807d98f-aa9e-485e-8256-fa92b8eb2a5b"),
  CustomerID: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  OrderDate: ISODate("2026-05-23T17:40:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202605-10111",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 13, кв. 5",
  OrderTotal: 15210.00
},
{
  _id: UUID("bd353f63-86cf-49ef-acdd-b49e7c12c52b"),
  OrderID: UUID("bd353f63-86cf-49ef-acdd-b49e7c12c52b"),
  CustomerID: UUID("0de065e6-b9cd-4bb4-876d-ae76cda0b6d0"),
  OrderDate: ISODate("2026-05-21T18:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202605-10112",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 8520.00
},
{
  _id: UUID("032911b1-0f8a-40a6-ba29-cb6bc6d8b19d"),
  OrderID: UUID("032911b1-0f8a-40a6-ba29-cb6bc6d8b19d"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-05-25T18:15:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202605-10113",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 9, кв. 1",
  OrderTotal: 5470.00
},
{
  _id: UUID("eab6bd66-088d-4703-ba54-fe5b41ff06c6"),
  OrderID: UUID("eab6bd66-088d-4703-ba54-fe5b41ff06c6"),
  CustomerID: UUID("ea1bb343-ca15-4d4c-9f6d-fa1ec33338f0"),
  OrderDate: ISODate("2026-05-24T12:30:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202605-10114",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Молодежная, д. 27, кв. 19",
  OrderTotal: 7460.00
},
{
  _id: UUID("18090156-a980-4c94-ab12-f2e0d127f9c6"),
  OrderID: UUID("18090156-a980-4c94-ab12-f2e0d127f9c6"),
  CustomerID: UUID("97980e91-c442-4c3d-bf8e-13a791807b56"),
  OrderDate: ISODate("2026-05-26T14:45:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202605-10115",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 19960.00
},
{
  _id: UUID("7a9d0ec2-160e-4cf4-9902-51ea06f393e5"),
  OrderID: UUID("7a9d0ec2-160e-4cf4-9902-51ea06f393e5"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-05-23T11:50:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "WEB-202605-10116",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 9, кв. 1",
  OrderTotal: 4730.00
},
{
  _id: UUID("040ba320-893d-4647-89b7-b644a8f05b94"),
  OrderID: UUID("040ba320-893d-4647-89b7-b644a8f05b94"),
  CustomerID: UUID("0c196312-145a-4819-996d-d1185167155a"),
  OrderDate: ISODate("2026-05-28T19:50:00"),
  DeliveryStatus: "Отменен",
  ExternalOrderNumber: "WEB-202605-10117",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Гагарина, д. 24, кв. 16",
  OrderTotal: 8490.00
},
{
  _id: UUID("62b931e5-a13c-48e7-a252-b495229100a0"),
  OrderID: UUID("62b931e5-a13c-48e7-a252-b495229100a0"),
  CustomerID: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  OrderDate: ISODate("2026-05-27T15:40:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "WEB-202605-10118",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 28, кв. 20",
  OrderTotal: 2390.00
},
{
  _id: UUID("8869f692-6e0b-4baf-b8ae-d01ebd3506d6"),
  OrderID: UUID("8869f692-6e0b-4baf-b8ae-d01ebd3506d6"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-05-25T15:15:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202605-10119",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 29810.00
},
{
  _id: UUID("367f90fb-6d95-4c44-b2a8-b082590926aa"),
  OrderID: UUID("367f90fb-6d95-4c44-b2a8-b082590926aa"),
  CustomerID: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  OrderDate: ISODate("2026-05-27T13:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202605-10120",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 13, кв. 5",
  OrderTotal: 2490.00
},
{
  _id: UUID("63d3fdb0-1bf7-45a7-a576-01d964e76b8d"),
  OrderID: UUID("63d3fdb0-1bf7-45a7-a576-01d964e76b8d"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-05-27T15:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202605-10121",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Советская, д. 36, кв. 28",
  OrderTotal: 5960.00
},
{
  _id: UUID("e6189dcd-885f-47eb-a869-c82a994a35a2"),
  OrderID: UUID("e6189dcd-885f-47eb-a869-c82a994a35a2"),
  CustomerID: UUID("d1e8f50e-45a6-4110-b316-e70755da1a56"),
  OrderDate: ISODate("2026-05-30T14:15:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202605-10122",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 32, кв. 24",
  OrderTotal: 4730.00
},
{
  _id: UUID("af2fe39f-d160-41f6-a171-c67daddab7d8"),
  OrderID: UUID("af2fe39f-d160-41f6-a171-c67daddab7d8"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  OrderDate: ISODate("2026-05-29T13:15:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202605-10123",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 18, кв. 10",
  OrderTotal: 3440.00
},
{
  _id: UUID("433b58bf-3360-4643-9a8b-7026f5b04b79"),
  OrderID: UUID("433b58bf-3360-4643-9a8b-7026f5b04b79"),
  CustomerID: UUID("78a6fb3e-2503-4d1b-bff2-34a42dae1c38"),
  OrderDate: ISODate("2026-05-29T19:30:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "WEB-202605-10124",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 19, кв. 11",
  OrderTotal: 790.00
},
{
  _id: UUID("104107bf-40c4-4f64-addc-9bb9a774fc62"),
  OrderID: UUID("104107bf-40c4-4f64-addc-9bb9a774fc62"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  OrderDate: ISODate("2026-06-03T10:10:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202606-10125",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 18, кв. 10",
  OrderTotal: 4780.00
},
{
  _id: UUID("76a099fe-b5f8-46a4-8c11-86f102928391"),
  OrderID: UUID("76a099fe-b5f8-46a4-8c11-86f102928391"),
  CustomerID: UUID("008cc9e5-4bb5-4c63-823d-b649ad1b4148"),
  OrderDate: ISODate("2026-06-01T09:10:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202606-10126",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 29, кв. 21",
  OrderTotal: 40510.00
},
{
  _id: UUID("b13568a0-b935-4e58-88bb-08b07d51a202"),
  OrderID: UUID("b13568a0-b935-4e58-88bb-08b07d51a202"),
  CustomerID: UUID("6c3074a1-d25a-44c0-942e-4273346d83d2"),
  OrderDate: ISODate("2026-06-03T17:30:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202606-10127",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 8440.00
},
{
  _id: UUID("d58f5214-d2bc-426b-8c35-21c4ac4534ad"),
  OrderID: UUID("d58f5214-d2bc-426b-8c35-21c4ac4534ad"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  OrderDate: ISODate("2026-06-01T15:45:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "SHOP-202606-10128",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 2980.00
},
{
  _id: UUID("199f591c-b967-4647-8a0e-994bd27886ed"),
  OrderID: UUID("199f591c-b967-4647-8a0e-994bd27886ed"),
  CustomerID: UUID("878799a7-eae6-4ce8-9e91-2f112505d732"),
  OrderDate: ISODate("2026-06-03T13:20:00"),
  DeliveryStatus: "Новый",
  ExternalOrderNumber: "SHOP-202606-10129",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 4020.00
},
{
  _id: UUID("0e60a764-ac8c-48a3-a742-155e279d12d6"),
  OrderID: UUID("0e60a764-ac8c-48a3-a742-155e279d12d6"),
  CustomerID: UUID("14022270-8716-482e-ac32-60ca1313aa84"),
  OrderDate: ISODate("2026-06-01T15:20:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202606-10130",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Энтузиастов, д. 30, кв. 22",
  OrderTotal: 4970.00
},
{
  _id: UUID("01952a98-bb7e-4b51-84a4-62fc929ddaaa"),
  OrderID: UUID("01952a98-bb7e-4b51-84a4-62fc929ddaaa"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-06-01T09:00:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "SHOP-202606-10131",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 1170.00
},
{
  _id: UUID("515e192e-0699-4d8f-a071-3c8953501253"),
  OrderID: UUID("515e192e-0699-4d8f-a071-3c8953501253"),
  CustomerID: UUID("74d7b462-2d6a-47ad-b2d1-5808a4aad8f8"),
  OrderDate: ISODate("2026-06-05T14:20:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "WEB-202606-10132",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Дружбы, д. 13, кв. 5",
  OrderTotal: 6570.00
},
{
  _id: UUID("f955243a-e8e4-4d7f-84af-b5e71c4f436e"),
  OrderID: UUID("f955243a-e8e4-4d7f-84af-b5e71c4f436e"),
  CustomerID: UUID("14544af5-45ca-4e3b-a9cd-fd72cf09b85f"),
  OrderDate: ISODate("2026-06-04T14:40:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "SHOP-202606-10133",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 5490.00
},
{
  _id: UUID("168dd8b6-b40a-44d5-afe7-84d01ee02a8d"),
  OrderID: UUID("168dd8b6-b40a-44d5-afe7-84d01ee02a8d"),
  CustomerID: UUID("66d35801-d16c-495b-9312-a1e3a446fe92"),
  OrderDate: ISODate("2026-06-02T17:15:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202606-10134",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Молодежная, д. 37, кв. 29",
  OrderTotal: 3950.00
},
{
  _id: UUID("aecc9c9d-b8d7-40da-aca5-714b3f53218c"),
  OrderID: UUID("aecc9c9d-b8d7-40da-aca5-714b3f53218c"),
  CustomerID: UUID("6daf8cd2-ae3d-4725-8763-49a0acf008f3"),
  OrderDate: ISODate("2026-06-04T16:00:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202606-10135",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Ленина, д. 18, кв. 10",
  OrderTotal: 5470.00
},
{
  _id: UUID("fe6e39a9-b719-4c4d-bd28-b54d13f70821"),
  OrderID: UUID("fe6e39a9-b719-4c4d-bd28-b54d13f70821"),
  CustomerID: UUID("567171a0-5ff2-4e97-9fde-2a1202eb47d5"),
  OrderDate: ISODate("2026-06-05T11:20:00"),
  DeliveryStatus: "В обработке",
  ExternalOrderNumber: "WEB-202606-10136",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Строителей, д. 22, кв. 14",
  OrderTotal: 2390.00
},
{
  _id: UUID("836f5729-e2fe-4c17-8c1b-ab541ef24d86"),
  OrderID: UUID("836f5729-e2fe-4c17-8c1b-ab541ef24d86"),
  CustomerID: UUID("0c196312-145a-4819-996d-d1185167155a"),
  OrderDate: ISODate("2026-06-03T14:30:00"),
  DeliveryStatus: "Ожидает оплаты",
  ExternalOrderNumber: "WEB-202606-10137",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Гагарина, д. 24, кв. 16",
  OrderTotal: 7790.00
},
{
  _id: UUID("6db38d0f-d15e-4988-861b-9f2bdc559c3f"),
  OrderID: UUID("6db38d0f-d15e-4988-861b-9f2bdc559c3f"),
  CustomerID: UUID("094279c3-0c9f-4480-a84d-35307b000cf0"),
  OrderDate: ISODate("2026-06-06T14:20:00"),
  DeliveryStatus: "Доставлен",
  ExternalOrderNumber: "WEB-202606-10138",
  IsOnlineOrder: true,
  DeliveryAddress: "г. Волгодонск, ул. Морская, д. 9, кв. 1",
  OrderTotal: 2490.00
},
{
  _id: UUID("e16a5181-ec1c-4f99-bf95-a1a4fe4d7340"),
  OrderID: UUID("e16a5181-ec1c-4f99-bf95-a1a4fe4d7340"),
  CustomerID: UUID("c6133597-c26a-485a-84b3-c3c8b8a738f5"),
  OrderDate: ISODate("2026-06-04T09:15:00"),
  DeliveryStatus: "Передан в доставку",
  ExternalOrderNumber: "SHOP-202606-10139",
  IsOnlineOrder: false,
  DeliveryAddress: "",
  OrderTotal: 7860.00
}
];
database.getCollection("orders").insertMany(orders);

const orderDetails = [
{
  OrderID: UUID("c72b436e-c2b3-4f86-8a13-74d6456d4d32"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 7950.00
},
{
  OrderID: UUID("bc9753ed-d7a1-4cb7-adf5-d2adc372a80c"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 560.00
},
{
  OrderID: UUID("bc9753ed-d7a1-4cb7-adf5-d2adc372a80c"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("b6bd15f4-30ae-4185-a43b-44deca17d1f3"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("b6bd15f4-30ae-4185-a43b-44deca17d1f3"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("2dff08be-2787-4083-851e-8c8cbd891f38"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2190.00
},
{
  OrderID: UUID("2dff08be-2787-4083-851e-8c8cbd891f38"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 980.00
},
{
  OrderID: UUID("0b43d5fa-0d08-4147-b1b1-d64711cd3b77"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("0b43d5fa-0d08-4147-b1b1-d64711cd3b77"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("d6f1db1b-aa70-47e1-a60e-be11699a2efc"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2190.00
},
{
  OrderID: UUID("32187d38-d1d6-447e-958d-b3a2fbc45540"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1360.00
},
{
  OrderID: UUID("6513ee1d-f177-4e61-aaf9-845041207c7c"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1580.00
},
{
  OrderID: UUID("564deb05-5823-41e8-9c30-47f3c53ce5ea"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 310.00
},
{
  OrderID: UUID("564deb05-5823-41e8-9c30-47f3c53ce5ea"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("2c055f2f-730d-4c1d-887e-38e0737c1aa9"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("2c055f2f-730d-4c1d-887e-38e0737c1aa9"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1840.00
},
{
  OrderID: UUID("eb2ac074-b869-45ba-9f0f-a807f318b425"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1180.00
},
{
  OrderID: UUID("3aac6bbb-afa1-455b-919b-c5b520646f37"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 1470.00
},
{
  OrderID: UUID("3aac6bbb-afa1-455b-919b-c5b520646f37"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4380.00
},
{
  OrderID: UUID("3aac6bbb-afa1-455b-919b-c5b520646f37"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 560.00
},
{
  OrderID: UUID("58b47ff6-48d5-438a-9572-21cba51e3f13"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("28dcd142-cb7a-4f14-a093-a32d247ebb5e"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("a34cc425-0a71-4ef1-8a95-41071c6ad8e6"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1580.00
},
{
  OrderID: UUID("a34cc425-0a71-4ef1-8a95-41071c6ad8e6"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 620.00
},
{
  OrderID: UUID("d17cbddd-bf8e-4c0a-90be-18197c1e34b8"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("d17cbddd-bf8e-4c0a-90be-18197c1e34b8"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("e9ff6193-ef1c-4750-bc94-564116b714f1"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("e9ff6193-ef1c-4750-bc94-564116b714f1"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("e9ff6193-ef1c-4750-bc94-564116b714f1"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("72538ed9-3b15-48f9-bb3f-3418a451bd4f"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 3540.00
},
{
  OrderID: UUID("6bafebe0-89d7-4c1a-9626-4ad1bac4f223"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 17160.00
},
{
  OrderID: UUID("970fa3b6-36f2-436c-82ae-a0c532775b32"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 2370.00
},
{
  OrderID: UUID("970fa3b6-36f2-436c-82ae-a0c532775b32"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4980.00
},
{
  OrderID: UUID("6b45579a-e401-4861-a37f-84d1b1b3896f"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2190.00
},
{
  OrderID: UUID("8e803803-fa04-409e-8ec4-478a0d11e68e"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3790.00
},
{
  OrderID: UUID("8e803803-fa04-409e-8ec4-478a0d11e68e"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 8580.00
},
{
  OrderID: UUID("8e803803-fa04-409e-8ec4-478a0d11e68e"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 10470.00
},
{
  OrderID: UUID("8e803803-fa04-409e-8ec4-478a0d11e68e"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2580.00
},
{
  OrderID: UUID("66b29d47-0c78-4a43-8741-fc0eaeeb546a"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("912dae00-626e-468e-b0ee-19bc6e33bdf6"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3790.00
},
{
  OrderID: UUID("e47c3d88-a445-4bae-8c91-9f7357db7984"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("2841ba18-4f7b-48ef-a6ab-a8a5a60f6fd2"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("36e325d2-a436-4bfa-8615-e49511a52b6d"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("36e325d2-a436-4bfa-8615-e49511a52b6d"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 5160.00
},
{
  OrderID: UUID("81048032-32f1-4c29-b2e8-baec46d6f5b4"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5300.00
},
{
  OrderID: UUID("81048032-32f1-4c29-b2e8-baec46d6f5b4"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("88d6b780-a3ae-45a2-ab1a-748c98387cd4"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("88d6b780-a3ae-45a2-ab1a-748c98387cd4"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 1470.00
},
{
  OrderID: UUID("ab21bad6-1ab1-4942-8f0f-c6285c6152ea"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 620.00
},
{
  OrderID: UUID("ab21bad6-1ab1-4942-8f0f-c6285c6152ea"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 16470.00
},
{
  OrderID: UUID("c74623a9-8b6e-446d-a52a-9ec6dc82bccc"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("a822c162-b7e7-4980-8930-e8c2cc9053ad"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("a822c162-b7e7-4980-8930-e8c2cc9053ad"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1840.00
},
{
  OrderID: UUID("0ac768f4-a4cc-4233-b4fd-52de91eae985"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 310.00
},
{
  OrderID: UUID("0ac768f4-a4cc-4233-b4fd-52de91eae985"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("cb63c10a-fd66-4b0f-a3a5-e993fae5564a"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("00636bad-9e10-43dd-96ba-3e901211d0a9"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("a8679c74-218e-427d-a93e-d10a329600ec"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("a8679c74-218e-427d-a93e-d10a329600ec"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1180.00
},
{
  OrderID: UUID("55bf3a1f-ee4e-45f3-a0a7-5f0bd066c7ac"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 3540.00
},
{
  OrderID: UUID("55bf3a1f-ee4e-45f3-a0a7-5f0bd066c7ac"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("fa866c3c-9751-410f-9a7a-180d4edc41fe"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 13960.00
},
{
  OrderID: UUID("8c646b55-8a91-4dda-857c-533514ef551b"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1180.00
},
{
  OrderID: UUID("8c646b55-8a91-4dda-857c-533514ef551b"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1590.00
},
{
  OrderID: UUID("92b833a7-d54b-49e9-9213-98d327d54f09"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("92b833a7-d54b-49e9-9213-98d327d54f09"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("31456baa-8591-4f91-a9b0-eaf7e1f7377c"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("31456baa-8591-4f91-a9b0-eaf7e1f7377c"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1290.00
},
{
  OrderID: UUID("35421669-9eed-48f1-98b7-1ad8fbf184dc"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("271e9bac-d5d3-4779-9560-560cf5b0c5cf"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("271e9bac-d5d3-4779-9560-560cf5b0c5cf"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2190.00
},
{
  OrderID: UUID("a9933afb-b82c-430f-9c94-ff4ef086fa6b"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("71e1feab-c186-429f-ae33-7b273337afd3"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("7b947164-1991-4eda-a8d7-fe4edfce80c1"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 2760.00
},
{
  OrderID: UUID("7b947164-1991-4eda-a8d7-fe4edfce80c1"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("7b947164-1991-4eda-a8d7-fe4edfce80c1"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("7b947164-1991-4eda-a8d7-fe4edfce80c1"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("3903bc70-dbf2-4e92-9d16-5c48263da70e"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("3903bc70-dbf2-4e92-9d16-5c48263da70e"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("e941b9d5-9825-4a6d-b804-29a7e67a2a6e"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5300.00
},
{
  OrderID: UUID("80f935ef-6f63-4dc6-8526-f61e14bef793"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 310.00
},
{
  OrderID: UUID("a43dd195-64f1-4223-a728-786250d8d730"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("9d29d03a-a9d9-4e02-86d5-e8cc2639bcae"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 310.00
},
{
  OrderID: UUID("9d29d03a-a9d9-4e02-86d5-e8cc2639bcae"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("47d3fce7-f86d-43ed-b35e-64705539cc7f"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("47d3fce7-f86d-43ed-b35e-64705539cc7f"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2740.00
},
{
  OrderID: UUID("ac462906-e1b7-446a-a52d-c613f2acaf9d"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("ac462906-e1b7-446a-a52d-c613f2acaf9d"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1370.00
},
{
  OrderID: UUID("be515ce6-d382-4b14-9be6-14ad18e022d3"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("9a72eb0b-7496-4071-8e6d-d1ea6ad86356"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4980.00
},
{
  OrderID: UUID("9a72eb0b-7496-4071-8e6d-d1ea6ad86356"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1370.00
},
{
  OrderID: UUID("9a72eb0b-7496-4071-8e6d-d1ea6ad86356"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3790.00
},
{
  OrderID: UUID("1fffe321-44c7-4ffd-bfb3-86b0f9e740b4"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 560.00
},
{
  OrderID: UUID("e5bd84dc-844e-47ec-a2ea-2e15cc5a45f5"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4780.00
},
{
  OrderID: UUID("28a3d54e-c2f3-4fca-a63c-3a0f190789ad"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 4290.00
},
{
  OrderID: UUID("28a3d54e-c2f3-4fca-a63c-3a0f190789ad"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1590.00
},
{
  OrderID: UUID("424cc51d-faad-4fd4-8265-c6a7843456a0"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1840.00
},
{
  OrderID: UUID("99981bdc-9db6-4c9b-89fe-6bfffa68b110"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("99981bdc-9db6-4c9b-89fe-6bfffa68b110"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1290.00
},
{
  OrderID: UUID("abf33c72-cf25-4c77-9efb-0c5837b17514"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2890.00
},
{
  OrderID: UUID("b24a7205-215b-4c37-8112-d6c6121f62c1"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 10980.00
},
{
  OrderID: UUID("b24a7205-215b-4c37-8112-d6c6121f62c1"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4380.00
},
{
  OrderID: UUID("b24a7205-215b-4c37-8112-d6c6121f62c1"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3790.00
},
{
  OrderID: UUID("846e18fc-14f1-428a-b32a-ec486c2a7623"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("9bbb166d-4044-41e6-bcbe-30572cd2f91f"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("9bbb166d-4044-41e6-bcbe-30572cd2f91f"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 560.00
},
{
  OrderID: UUID("9bbb166d-4044-41e6-bcbe-30572cd2f91f"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("60c49087-93b1-4b0d-90de-de296882b589"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 5160.00
},
{
  OrderID: UUID("f69ab3da-36fe-4738-847d-de5a09717b42"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 620.00
},
{
  OrderID: UUID("f69ab3da-36fe-4738-847d-de5a09717b42"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 8580.00
},
{
  OrderID: UUID("538114f6-b562-48c0-b2ce-b9c30a5ea56d"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 7170.00
},
{
  OrderID: UUID("538114f6-b562-48c0-b2ce-b9c30a5ea56d"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("08d675c8-025a-4cfa-accf-7c858fcfcbf7"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 7960.00
},
{
  OrderID: UUID("08d675c8-025a-4cfa-accf-7c858fcfcbf7"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1180.00
},
{
  OrderID: UUID("61138ed6-1b35-4334-9635-08f45361576d"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 2370.00
},
{
  OrderID: UUID("638ada9e-002f-4b95-80ae-b2b4d1358603"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3790.00
},
{
  OrderID: UUID("638ada9e-002f-4b95-80ae-b2b4d1358603"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("14e75d90-fc01-4034-8e36-4ad933f0fc72"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 8580.00
},
{
  OrderID: UUID("4da1c620-42bd-4297-b1b5-c2969612e53a"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("4da1c620-42bd-4297-b1b5-c2969612e53a"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 1470.00
},
{
  OrderID: UUID("7c15634f-62ce-4551-baef-39ab70749110"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1840.00
},
{
  OrderID: UUID("7c15634f-62ce-4551-baef-39ab70749110"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1360.00
},
{
  OrderID: UUID("fccb1c9d-3d37-4c30-a8b6-f220860e5188"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1590.00
},
{
  OrderID: UUID("fccb1c9d-3d37-4c30-a8b6-f220860e5188"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("fccb1c9d-3d37-4c30-a8b6-f220860e5188"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 310.00
},
{
  OrderID: UUID("cb627157-3053-4aa0-ac27-11570229c0f1"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4980.00
},
{
  OrderID: UUID("e747011f-f39d-4b1e-b4a0-03391f233a3c"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("e747011f-f39d-4b1e-b4a0-03391f233a3c"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5780.00
},
{
  OrderID: UUID("e747011f-f39d-4b1e-b4a0-03391f233a3c"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 620.00
},
{
  OrderID: UUID("49957640-6d54-4c2a-9359-d914fc7e8bd9"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("2470a601-7ad3-478b-be5a-2d380c3aebd3"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("127835ea-5a4d-40a8-8150-485b5774ef6b"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 12870.00
},
{
  OrderID: UUID("127835ea-5a4d-40a8-8150-485b5774ef6b"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 620.00
},
{
  OrderID: UUID("127835ea-5a4d-40a8-8150-485b5774ef6b"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 4720.00
},
{
  OrderID: UUID("127835ea-5a4d-40a8-8150-485b5774ef6b"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("c650bda1-1db2-45e6-a27e-ee330fdbfc1f"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 2040.00
},
{
  OrderID: UUID("98c15f34-4bd7-4f2e-b365-74d8ee616536"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1370.00
},
{
  OrderID: UUID("98e31411-8ee9-4384-927f-41329c9ac598"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("98e31411-8ee9-4384-927f-41329c9ac598"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 10980.00
},
{
  OrderID: UUID("5e3f8a27-f6b1-41ae-84c9-4cdc27cccc82"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 3180.00
},
{
  OrderID: UUID("5e3f8a27-f6b1-41ae-84c9-4cdc27cccc82"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1120.00
},
{
  OrderID: UUID("30852555-56fb-43f6-86f1-6d7392afab75"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2190.00
},
{
  OrderID: UUID("30852555-56fb-43f6-86f1-6d7392afab75"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("03bb4049-d609-4add-8d12-a16a76b1fc1f"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1580.00
},
{
  OrderID: UUID("03bb4049-d609-4add-8d12-a16a76b1fc1f"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("03bb4049-d609-4add-8d12-a16a76b1fc1f"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1370.00
},
{
  OrderID: UUID("50f30f65-d066-45df-a3ca-0b3c39642d59"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2890.00
},
{
  OrderID: UUID("50f30f65-d066-45df-a3ca-0b3c39642d59"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("50f30f65-d066-45df-a3ca-0b3c39642d59"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("7a7dace2-ae08-4599-bf64-bcec020cb0cf"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 3980.00
},
{
  OrderID: UUID("c69bc1ef-8108-4fc7-9bad-ee02d468cfb8"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1120.00
},
{
  OrderID: UUID("c69bc1ef-8108-4fc7-9bad-ee02d468cfb8"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("c69bc1ef-8108-4fc7-9bad-ee02d468cfb8"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3790.00
},
{
  OrderID: UUID("528895c5-8146-43fa-8a3b-01b565203345"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 8580.00
},
{
  OrderID: UUID("f63ea85e-6d63-470a-aa54-62ec908e0044"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 3180.00
},
{
  OrderID: UUID("f63ea85e-6d63-470a-aa54-62ec908e0044"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("5e80807e-e418-42cb-9b97-0c8bad5f6d00"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 4720.00
},
{
  OrderID: UUID("5e80807e-e418-42cb-9b97-0c8bad5f6d00"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 10980.00
},
{
  OrderID: UUID("7e583da2-488e-4b0c-95fd-4cea3ffe493d"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3790.00
},
{
  OrderID: UUID("747b7f77-10ec-4a1d-b43b-5faf204de8c4"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 4290.00
},
{
  OrderID: UUID("747b7f77-10ec-4a1d-b43b-5faf204de8c4"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1580.00
},
{
  OrderID: UUID("747b7f77-10ec-4a1d-b43b-5faf204de8c4"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 1680.00
},
{
  OrderID: UUID("2c55bd53-aa8b-4882-a353-b423644c0169"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("07e52468-31cb-4daf-8789-79d3cfd06ad6"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 4770.00
},
{
  OrderID: UUID("07e52468-31cb-4daf-8789-79d3cfd06ad6"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 620.00
},
{
  OrderID: UUID("f7155c81-6cec-4335-b16a-cda6cdcd4011"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1180.00
},
{
  OrderID: UUID("f7155c81-6cec-4335-b16a-cda6cdcd4011"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("ac0e311f-40c3-4465-ba3b-f034558c4b80"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("ac0e311f-40c3-4465-ba3b-f034558c4b80"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5300.00
},
{
  OrderID: UUID("ac0e311f-40c3-4465-ba3b-f034558c4b80"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 10980.00
},
{
  OrderID: UUID("eb11132c-bea5-487c-96e4-6abd8c571b9a"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 2040.00
},
{
  OrderID: UUID("eb11132c-bea5-487c-96e4-6abd8c571b9a"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("c7df4f66-bc69-46a4-b1bc-9fa7b15d1430"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 3180.00
},
{
  OrderID: UUID("d55b4f75-7289-45ad-b94e-b1679b0eacc6"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("d55b4f75-7289-45ad-b94e-b1679b0eacc6"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("f6cfb14d-2d62-4d8d-84b6-993f92425cbd"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 560.00
},
{
  OrderID: UUID("594972c3-a9eb-41ae-b0af-6e6af4947af5"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("594972c3-a9eb-41ae-b0af-6e6af4947af5"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("594972c3-a9eb-41ae-b0af-6e6af4947af5"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("f32b3c55-544c-49d5-9017-6750aedd3d53"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 3180.00
},
{
  OrderID: UUID("5f0aac5f-c981-4d7d-8403-9969ae8481e1"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1840.00
},
{
  OrderID: UUID("5f0aac5f-c981-4d7d-8403-9969ae8481e1"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1180.00
},
{
  OrderID: UUID("5f0aac5f-c981-4d7d-8403-9969ae8481e1"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 6570.00
},
{
  OrderID: UUID("9d43c63e-5feb-4968-8350-7fd4164968b0"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1590.00
},
{
  OrderID: UUID("9d43c63e-5feb-4968-8350-7fd4164968b0"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 560.00
},
{
  OrderID: UUID("6906e733-9798-4f22-a63c-5ccc0ed3df8c"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("6906e733-9798-4f22-a63c-5ccc0ed3df8c"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 11370.00
},
{
  OrderID: UUID("5959c5ba-2c97-4424-8761-a491d99e0363"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1370.00
},
{
  OrderID: UUID("5959c5ba-2c97-4424-8761-a491d99e0363"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1580.00
},
{
  OrderID: UUID("011ab2c6-d1f5-4a38-81a5-59d1c9c0e84a"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 6980.00
},
{
  OrderID: UUID("011ab2c6-d1f5-4a38-81a5-59d1c9c0e84a"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2740.00
},
{
  OrderID: UUID("42dbc97f-004c-4692-8af7-05bd295900d9"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("804b749f-b445-4388-af4d-87dc707899f5"),
  ProductID: UUID("81c172b6-078a-4285-a04e-f884c550d0f2"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 7580.00
},
{
  OrderID: UUID("432f499c-296c-4edb-8e81-90f7df22af5f"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("432f499c-296c-4edb-8e81-90f7df22af5f"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 3540.00
},
{
  OrderID: UUID("432f499c-296c-4edb-8e81-90f7df22af5f"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5300.00
},
{
  OrderID: UUID("c807d98f-aa9e-485e-8256-fa92b8eb2a5b"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2890.00
},
{
  OrderID: UUID("c807d98f-aa9e-485e-8256-fa92b8eb2a5b"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 2760.00
},
{
  OrderID: UUID("c807d98f-aa9e-485e-8256-fa92b8eb2a5b"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 980.00
},
{
  OrderID: UUID("c807d98f-aa9e-485e-8256-fa92b8eb2a5b"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 8580.00
},
{
  OrderID: UUID("bd353f63-86cf-49ef-acdd-b49e7c12c52b"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2740.00
},
{
  OrderID: UUID("bd353f63-86cf-49ef-acdd-b49e7c12c52b"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5780.00
},
{
  OrderID: UUID("032911b1-0f8a-40a6-ba29-cb6bc6d8b19d"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4980.00
},
{
  OrderID: UUID("032911b1-0f8a-40a6-ba29-cb6bc6d8b19d"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("eab6bd66-088d-4703-ba54-fe5b41ff06c6"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5780.00
},
{
  OrderID: UUID("eab6bd66-088d-4703-ba54-fe5b41ff06c6"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 1680.00
},
{
  OrderID: UUID("18090156-a980-4c94-ab12-f2e0d127f9c6"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 16470.00
},
{
  OrderID: UUID("18090156-a980-4c94-ab12-f2e0d127f9c6"),
  ProductID: UUID("245a9a4d-1a7e-4b8d-a330-667444e932f8"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 3490.00
},
{
  OrderID: UUID("7a9d0ec2-160e-4cf4-9902-51ea06f393e5"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2890.00
},
{
  OrderID: UUID("7a9d0ec2-160e-4cf4-9902-51ea06f393e5"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1840.00
},
{
  OrderID: UUID("040ba320-893d-4647-89b7-b644a8f05b94"),
  ProductID: UUID("186409f6-2ac4-44d3-8eae-020eff6bf57c"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 5780.00
},
{
  OrderID: UUID("040ba320-893d-4647-89b7-b644a8f05b94"),
  ProductID: UUID("05ac06d4-7deb-4c48-876e-8291e43fd1c5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1120.00
},
{
  OrderID: UUID("040ba320-893d-4647-89b7-b644a8f05b94"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1590.00
},
{
  OrderID: UUID("62b931e5-a13c-48e7-a252-b495229100a0"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("8869f692-6e0b-4baf-b8ae-d01ebd3506d6"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 920.00
},
{
  OrderID: UUID("8869f692-6e0b-4baf-b8ae-d01ebd3506d6"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 7950.00
},
{
  OrderID: UUID("8869f692-6e0b-4baf-b8ae-d01ebd3506d6"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 9960.00
},
{
  OrderID: UUID("8869f692-6e0b-4baf-b8ae-d01ebd3506d6"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 10980.00
},
{
  OrderID: UUID("367f90fb-6d95-4c44-b2a8-b082590926aa"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("63d3fdb0-1bf7-45a7-a576-01d964e76b8d"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4980.00
},
{
  OrderID: UUID("63d3fdb0-1bf7-45a7-a576-01d964e76b8d"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 980.00
},
{
  OrderID: UUID("e6189dcd-885f-47eb-a869-c82a994a35a2"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("e6189dcd-885f-47eb-a869-c82a994a35a2"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2740.00
},
{
  OrderID: UUID("af2fe39f-d160-41f6-a171-c67daddab7d8"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("af2fe39f-d160-41f6-a171-c67daddab7d8"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("433b58bf-3360-4643-9a8b-7026f5b04b79"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 790.00
},
{
  OrderID: UUID("104107bf-40c4-4f64-addc-9bb9a774fc62"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("104107bf-40c4-4f64-addc-9bb9a774fc62"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 4290.00
},
{
  OrderID: UUID("76a099fe-b5f8-46a4-8c11-86f102928391"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 1840.00
},
{
  OrderID: UUID("76a099fe-b5f8-46a4-8c11-86f102928391"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 8760.00
},
{
  OrderID: UUID("76a099fe-b5f8-46a4-8c11-86f102928391"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 4,
  OrderDetailAmount: 21960.00
},
{
  OrderID: UUID("76a099fe-b5f8-46a4-8c11-86f102928391"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 7950.00
},
{
  OrderID: UUID("b13568a0-b935-4e58-88bb-08b07d51a202"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 7950.00
},
{
  OrderID: UUID("b13568a0-b935-4e58-88bb-08b07d51a202"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("d58f5214-d2bc-426b-8c35-21c4ac4534ad"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2360.00
},
{
  OrderID: UUID("d58f5214-d2bc-426b-8c35-21c4ac4534ad"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 620.00
},
{
  OrderID: UUID("199f591c-b967-4647-8a0e-994bd27886ed"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2650.00
},
{
  OrderID: UUID("199f591c-b967-4647-8a0e-994bd27886ed"),
  ProductID: UUID("69d24e91-27bf-4a54-9668-cbaa8a195f67"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1370.00
},
{
  OrderID: UUID("0e60a764-ac8c-48a3-a742-155e279d12d6"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2580.00
},
{
  OrderID: UUID("0e60a764-ac8c-48a3-a742-155e279d12d6"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("01952a98-bb7e-4b51-84a4-62fc929ddaaa"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 680.00
},
{
  OrderID: UUID("01952a98-bb7e-4b51-84a4-62fc929ddaaa"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 490.00
},
{
  OrderID: UUID("515e192e-0699-4d8f-a071-3c8953501253"),
  ProductID: UUID("c4b76baa-9170-47ba-b682-727c91016912"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: 6570.00
},
{
  OrderID: UUID("f955243a-e8e4-4d7f-84af-b5e71c4f436e"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("168dd8b6-b40a-44d5-afe7-84d01ee02a8d"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1590.00
},
{
  OrderID: UUID("168dd8b6-b40a-44d5-afe7-84d01ee02a8d"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 2360.00
},
{
  OrderID: UUID("aecc9c9d-b8d7-40da-aca5-714b3f53218c"),
  ProductID: UUID("d33ff2fe-ba2a-4a35-8f7f-d01a28142c36"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1180.00
},
{
  OrderID: UUID("aecc9c9d-b8d7-40da-aca5-714b3f53218c"),
  ProductID: UUID("64116e89-948c-4d6c-b3bd-68596681c3e5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 4290.00
},
{
  OrderID: UUID("fe6e39a9-b719-4c4d-bd28-b54d13f70821"),
  ProductID: UUID("922590f1-6108-441c-89c2-6a8fdedb5c0a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2390.00
},
{
  OrderID: UUID("836f5729-e2fe-4c17-8c1b-ab541ef24d86"),
  ProductID: UUID("2a607c47-22ce-4c55-a343-d2a796f83340"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1990.00
},
{
  OrderID: UUID("836f5729-e2fe-4c17-8c1b-ab541ef24d86"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 5490.00
},
{
  OrderID: UUID("836f5729-e2fe-4c17-8c1b-ab541ef24d86"),
  ProductID: UUID("ad2b5949-7eeb-4134-8d37-b94f5df3d16e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 310.00
},
{
  OrderID: UUID("6db38d0f-d15e-4988-861b-9f2bdc559c3f"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 2490.00
},
{
  OrderID: UUID("e16a5181-ec1c-4f99-bf95-a1a4fe4d7340"),
  ProductID: UUID("25c26e93-3f0a-4691-a1e5-5b54ada06aec"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1590.00
},
{
  OrderID: UUID("e16a5181-ec1c-4f99-bf95-a1a4fe4d7340"),
  ProductID: UUID("c8e1a728-3c7b-418e-b6b6-d47c020c7e89"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: 1290.00
},
{
  OrderID: UUID("e16a5181-ec1c-4f99-bf95-a1a4fe4d7340"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: 4980.00
}
];
database.getCollection("order-details").insertMany(orderDetails);

const defectives = [
{
  _id: UUID("6272ef99-6188-43da-b505-06a174aba858"),
  DefectiveID: UUID("6272ef99-6188-43da-b505-06a174aba858"),
  ProductID: UUID("f14a5cee-ee4b-4e89-9f4e-b610e5868ae2"),
  Quantity: 2,
  DateDeclared: ISODate("2026-02-07T11:00:00")
},
{
  _id: UUID("9e7f0bf1-0b3a-4185-8fa0-63d60efb6bf8"),
  DefectiveID: UUID("9e7f0bf1-0b3a-4185-8fa0-63d60efb6bf8"),
  ProductID: UUID("8d8ae379-33ac-4d52-bfe7-d359961c705b"),
  Quantity: 2,
  DateDeclared: ISODate("2026-03-08T11:20:00")
},
{
  _id: UUID("b45a26d2-39ba-45b7-832d-8c732d56149e"),
  DefectiveID: UUID("b45a26d2-39ba-45b7-832d-8c732d56149e"),
  ProductID: UUID("53f8516a-52bf-4405-a8a8-3e4287741999"),
  Quantity: 3,
  DateDeclared: ISODate("2026-03-21T14:30:00")
},
{
  _id: UUID("2439dbe9-34ac-4751-ade7-e70586be577e"),
  DefectiveID: UUID("2439dbe9-34ac-4751-ade7-e70586be577e"),
  ProductID: UUID("794e0bb6-5fdd-4af6-916e-45f55cb311f7"),
  Quantity: 1,
  DateDeclared: ISODate("2026-04-08T16:00:00")
},
{
  _id: UUID("d5702bfe-e084-4d16-968e-06b6f0186341"),
  DefectiveID: UUID("d5702bfe-e084-4d16-968e-06b6f0186341"),
  ProductID: UUID("09e6517b-76ef-47f7-9146-36f700f88130"),
  Quantity: 1,
  DateDeclared: ISODate("2026-04-22T16:50:00")
},
{
  _id: UUID("e81f45cb-277d-437a-8e2d-6cab36253b34"),
  DefectiveID: UUID("e81f45cb-277d-437a-8e2d-6cab36253b34"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  Quantity: 2,
  DateDeclared: ISODate("2026-05-08T12:20:00")
},
{
  _id: UUID("e0e093f7-1620-4523-b233-37aafbd6dea0"),
  DefectiveID: UUID("e0e093f7-1620-4523-b233-37aafbd6dea0"),
  ProductID: UUID("fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16"),
  Quantity: 3,
  DateDeclared: ISODate("2026-06-02T12:00:00")
},
{
  _id: UUID("19956a80-c69a-4a02-b793-95aae946fe68"),
  DefectiveID: UUID("19956a80-c69a-4a02-b793-95aae946fe68"),
  ProductID: UUID("aabd99d2-a638-46a5-a16f-86ccf1cf82d9"),
  Quantity: 1,
  DateDeclared: ISODate("2026-06-03T12:10:00")
}
];
database.getCollection("defectives").insertMany(defectives);

const logs = [
{
  _id: UUID("0147c94b-a00c-42a3-af03-0277389b1570"),
  LogID: UUID("0147c94b-a00c-42a3-af03-0277389b1570"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:d33ff2fe-ba2a-4a35-8f7f-d01a28142c36; Quantity:52; Document:УПД-2026-02-0001; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-02-03T15:54:00")
},
{
  _id: UUID("f0a75dd3-567a-4b6c-b3c2-8bda20944894"),
  LogID: UUID("f0a75dd3-567a-4b6c-b3c2-8bda20944894"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:69d24e91-27bf-4a54-9668-cbaa8a195f67; Quantity:61; Document:НАКЛ-2026-02-0002; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-02-07T09:19:00")
},
{
  _id: UUID("088ad99b-adde-4765-998b-e5458bc87f07"),
  LogID: UUID("088ad99b-adde-4765-998b-e5458bc87f07"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:25c26e93-3f0a-4691-a1e5-5b54ada06aec; Quantity:24; Document:ЗКП-2026-02-0003; WarehouseID:a77bc88e-82da-418b-bdf3-abe9967b1c6a;",
  DateTime: ISODate("2026-02-07T17:04:00")
},
{
  _id: UUID("b6ed197b-a25a-4b72-aa0d-a7177625e832"),
  LogID: UUID("b6ed197b-a25a-4b72-aa0d-a7177625e832"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:25c26e93-3f0a-4691-a1e5-5b54ada06aec; Quantity:41; Document:УПД-2026-02-0004; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-02-09T13:49:00")
},
{
  _id: UUID("c36a00cb-0b40-40b2-bd5b-4cf062282d94"),
  LogID: UUID("c36a00cb-0b40-40b2-bd5b-4cf062282d94"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:186409f6-2ac4-44d3-8eae-020eff6bf57c; Quantity:54; Document:НАКЛ-2026-02-0005; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-02-15T13:44:00")
},
{
  _id: UUID("42d0beae-f142-48d0-863b-a4a0c0073270"),
  LogID: UUID("42d0beae-f142-48d0-863b-a4a0c0073270"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:c4b76baa-9170-47ba-b682-727c91016912; Quantity:41; Document:ЗКП-2026-02-0006; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-02-15T13:34:00")
},
{
  _id: UUID("95940ce9-f3e3-4447-8cee-3683859e1eca"),
  LogID: UUID("95940ce9-f3e3-4447-8cee-3683859e1eca"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:25c26e93-3f0a-4691-a1e5-5b54ada06aec; Quantity:32; Document:УПД-2026-02-0007; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-02-22T08:19:00")
},
{
  _id: UUID("387b405c-7377-465a-9d56-11290884e9a2"),
  LogID: UUID("387b405c-7377-465a-9d56-11290884e9a2"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:69d24e91-27bf-4a54-9668-cbaa8a195f67; Quantity:40; Document:НАКЛ-2026-02-0008; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-02-23T14:49:00")
},
{
  _id: UUID("78bab84e-c4a9-48aa-be31-86acef89983f"),
  LogID: UUID("78bab84e-c4a9-48aa-be31-86acef89983f"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:2a607c47-22ce-4c55-a343-d2a796f83340; Quantity:39; Document:ЗКП-2026-02-0009; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-02-27T08:44:00")
},
{
  _id: UUID("b5db3a15-10dc-4daa-8d90-a182b1d8204a"),
  LogID: UUID("b5db3a15-10dc-4daa-8d90-a182b1d8204a"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:186409f6-2ac4-44d3-8eae-020eff6bf57c; Quantity:54; Document:УПД-2026-03-0001; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-03-03T15:14:00")
},
{
  _id: UUID("70cec88e-cc18-4fe8-8a40-863e082d0ac7"),
  LogID: UUID("70cec88e-cc18-4fe8-8a40-863e082d0ac7"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:8d8ae379-33ac-4d52-bfe7-d359961c705b; Quantity:45; Document:НАКЛ-2026-03-0002; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-03-03T14:54:00")
},
{
  _id: UUID("8adc7148-95ac-4ae6-b855-67c886261b0f"),
  LogID: UUID("8adc7148-95ac-4ae6-b855-67c886261b0f"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:81c172b6-078a-4285-a04e-f884c550d0f2; Quantity:44; Document:ЗКП-2026-03-0003; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-03-07T13:24:00")
},
{
  _id: UUID("d696554e-73ca-4c70-8ac4-810098381174"),
  LogID: UUID("d696554e-73ca-4c70-8ac4-810098381174"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:05ac06d4-7deb-4c48-876e-8291e43fd1c5; Quantity:14; Document:УПД-2026-03-0004; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-03-07T16:19:00")
},
{
  _id: UUID("03559e5b-819c-4887-9585-c2b2628183ab"),
  LogID: UUID("03559e5b-819c-4887-9585-c2b2628183ab"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:8d8ae379-33ac-4d52-bfe7-d359961c705b; Quantity:10; Document:НАКЛ-2026-03-0005; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-03-09T10:04:00")
},
{
  _id: UUID("fad6cada-b2db-4d7c-b424-641724e94aa4"),
  LogID: UUID("fad6cada-b2db-4d7c-b424-641724e94aa4"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:25c26e93-3f0a-4691-a1e5-5b54ada06aec; Quantity:59; Document:ЗКП-2026-03-0006; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-03-14T15:54:00")
},
{
  _id: UUID("4ed780f1-543f-4b40-a75c-3413fd6b2c95"),
  LogID: UUID("4ed780f1-543f-4b40-a75c-3413fd6b2c95"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:c8e1a728-3c7b-418e-b6b6-d47c020c7e89; Quantity:63; Document:УПД-2026-03-0007; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-03-16T14:54:00")
},
{
  _id: UUID("204d9de8-55ce-45fc-b3c6-1f9d85b535a6"),
  LogID: UUID("204d9de8-55ce-45fc-b3c6-1f9d85b535a6"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:186409f6-2ac4-44d3-8eae-020eff6bf57c; Quantity:57; Document:НАКЛ-2026-03-0008; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-03-14T16:14:00")
},
{
  _id: UUID("2c82c18f-7dac-47c7-9e5e-c1734d281cee"),
  LogID: UUID("2c82c18f-7dac-47c7-9e5e-c1734d281cee"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:c8e1a728-3c7b-418e-b6b6-d47c020c7e89; Quantity:20; Document:ЗКП-2026-03-0009; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-03-20T09:44:00")
},
{
  _id: UUID("21d15a84-ce0c-4c50-90aa-3b91ab925e91"),
  LogID: UUID("21d15a84-ce0c-4c50-90aa-3b91ab925e91"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:53f8516a-52bf-4405-a8a8-3e4287741999; Quantity:33; Document:УПД-2026-03-0010; WarehouseID:a77bc88e-82da-418b-bdf3-abe9967b1c6a;",
  DateTime: ISODate("2026-03-21T14:44:00")
},
{
  _id: UUID("46af12fc-c10f-4ffa-ab75-0dc9beeb23f7"),
  LogID: UUID("46af12fc-c10f-4ffa-ab75-0dc9beeb23f7"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:aabd99d2-a638-46a5-a16f-86ccf1cf82d9; Quantity:21; Document:НАКЛ-2026-03-0011; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-03-23T15:49:00")
},
{
  _id: UUID("bbfe833c-793c-4b56-b23b-b498eb25839e"),
  LogID: UUID("bbfe833c-793c-4b56-b23b-b498eb25839e"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:2a607c47-22ce-4c55-a343-d2a796f83340; Quantity:30; Document:ЗКП-2026-03-0012; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-03-27T15:19:00")
},
{
  _id: UUID("5fa1197f-5cee-435b-923f-b36222bf0f02"),
  LogID: UUID("5fa1197f-5cee-435b-923f-b36222bf0f02"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:64116e89-948c-4d6c-b3bd-68596681c3e5; Quantity:52; Document:УПД-2026-03-0013; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-03-25T09:14:00")
},
{
  _id: UUID("176c2e94-218b-43a6-ba2f-8ac166b3fa87"),
  LogID: UUID("176c2e94-218b-43a6-ba2f-8ac166b3fa87"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:922590f1-6108-441c-89c2-6a8fdedb5c0a; Quantity:14; Document:НАКЛ-2026-03-0014; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-03-31T12:19:00")
},
{
  _id: UUID("1b19207c-a12e-4e09-a01c-66bcbebc1b7a"),
  LogID: UUID("1b19207c-a12e-4e09-a01c-66bcbebc1b7a"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:245a9a4d-1a7e-4b8d-a330-667444e932f8; Quantity:55; Document:УПД-2026-04-0001; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-04-04T16:49:00")
},
{
  _id: UUID("10cdf6a7-4a35-4bd6-a12c-f34d52d576e9"),
  LogID: UUID("10cdf6a7-4a35-4bd6-a12c-f34d52d576e9"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:64116e89-948c-4d6c-b3bd-68596681c3e5; Quantity:52; Document:НАКЛ-2026-04-0002; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-04-02T13:19:00")
},
{
  _id: UUID("8a523e32-1dad-4bd3-8ba2-8ac9af1ba451"),
  LogID: UUID("8a523e32-1dad-4bd3-8ba2-8ac9af1ba451"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:922590f1-6108-441c-89c2-6a8fdedb5c0a; Quantity:31; Document:ЗКП-2026-04-0003; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-04-07T13:54:00")
},
{
  _id: UUID("040bac72-b4fb-475f-b51c-763159c998e0"),
  LogID: UUID("040bac72-b4fb-475f-b51c-763159c998e0"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16; Quantity:15; Document:УПД-2026-04-0004; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-04-09T11:49:00")
},
{
  _id: UUID("3b13c3c0-170a-4016-a934-7ed9fb7ce87f"),
  LogID: UUID("3b13c3c0-170a-4016-a934-7ed9fb7ce87f"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:f14a5cee-ee4b-4e89-9f4e-b610e5868ae2; Quantity:16; Document:НАКЛ-2026-04-0005; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-04-14T17:19:00")
},
{
  _id: UUID("dd457b76-4f94-4208-b999-25449476faf9"),
  LogID: UUID("dd457b76-4f94-4208-b999-25449476faf9"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:25c26e93-3f0a-4691-a1e5-5b54ada06aec; Quantity:50; Document:ЗКП-2026-04-0006; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-04-17T13:04:00")
},
{
  _id: UUID("bbb3c03a-1b44-4fff-9f5d-a41f8414d731"),
  LogID: UUID("bbb3c03a-1b44-4fff-9f5d-a41f8414d731"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:09e6517b-76ef-47f7-9146-36f700f88130; Quantity:46; Document:УПД-2026-04-0007; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-04-18T13:19:00")
},
{
  _id: UUID("aed90e91-6c8b-4f00-b616-a8c05d0b7b92"),
  LogID: UUID("aed90e91-6c8b-4f00-b616-a8c05d0b7b92"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:922590f1-6108-441c-89c2-6a8fdedb5c0a; Quantity:40; Document:НАКЛ-2026-04-0008; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-04-20T09:14:00")
},
{
  _id: UUID("00c30cd7-870e-407b-932d-6eae1eaf303e"),
  LogID: UUID("00c30cd7-870e-407b-932d-6eae1eaf303e"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:186409f6-2ac4-44d3-8eae-020eff6bf57c; Quantity:28; Document:ЗКП-2026-04-0009; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-04-26T15:04:00")
},
{
  _id: UUID("ac0ac6b0-2ea2-4210-9372-7bc388ea779c"),
  LogID: UUID("ac0ac6b0-2ea2-4210-9372-7bc388ea779c"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:d33ff2fe-ba2a-4a35-8f7f-d01a28142c36; Quantity:37; Document:УПД-2026-04-0010; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-04-27T15:04:00")
},
{
  _id: UUID("ff5df579-0bc3-4215-9ae3-0b150a7a2f58"),
  LogID: UUID("ff5df579-0bc3-4215-9ae3-0b150a7a2f58"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:186409f6-2ac4-44d3-8eae-020eff6bf57c; Quantity:21; Document:УПД-2026-05-0001; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-05-01T13:34:00")
},
{
  _id: UUID("f2eac155-3f56-40f6-a1f8-3b03d30bd268"),
  LogID: UUID("f2eac155-3f56-40f6-a1f8-3b03d30bd268"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:8d8ae379-33ac-4d52-bfe7-d359961c705b; Quantity:41; Document:НАКЛ-2026-05-0002; WarehouseID:a77bc88e-82da-418b-bdf3-abe9967b1c6a;",
  DateTime: ISODate("2026-05-03T12:24:00")
},
{
  _id: UUID("c0f0e38c-141d-4f4b-b535-cc7296f95e1a"),
  LogID: UUID("c0f0e38c-141d-4f4b-b535-cc7296f95e1a"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16; Quantity:63; Document:ЗКП-2026-05-0003; WarehouseID:a77bc88e-82da-418b-bdf3-abe9967b1c6a;",
  DateTime: ISODate("2026-05-05T11:54:00")
},
{
  _id: UUID("4007973c-6de4-4230-a6ef-3bae96653006"),
  LogID: UUID("4007973c-6de4-4230-a6ef-3bae96653006"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:794e0bb6-5fdd-4af6-916e-45f55cb311f7; Quantity:24; Document:УПД-2026-05-0004; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-05-09T17:34:00")
},
{
  _id: UUID("d1286b78-9537-46eb-b0ff-10d53e0d2a3a"),
  LogID: UUID("d1286b78-9537-46eb-b0ff-10d53e0d2a3a"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:aabd99d2-a638-46a5-a16f-86ccf1cf82d9; Quantity:54; Document:НАКЛ-2026-05-0005; WarehouseID:a77bc88e-82da-418b-bdf3-abe9967b1c6a;",
  DateTime: ISODate("2026-05-09T14:14:00")
},
{
  _id: UUID("c5e14e46-17db-4486-afb7-65a421e6c600"),
  LogID: UUID("c5e14e46-17db-4486-afb7-65a421e6c600"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:d33ff2fe-ba2a-4a35-8f7f-d01a28142c36; Quantity:37; Document:ЗКП-2026-05-0006; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-05-10T11:24:00")
},
{
  _id: UUID("4dd5e2e5-bb26-46e1-9b90-2ffb1dd12d06"),
  LogID: UUID("4dd5e2e5-bb26-46e1-9b90-2ffb1dd12d06"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:c8e1a728-3c7b-418e-b6b6-d47c020c7e89; Quantity:64; Document:УПД-2026-05-0007; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-05-12T08:24:00")
},
{
  _id: UUID("984d7ecb-d1f5-4787-b38e-5cc2d75471af"),
  LogID: UUID("984d7ecb-d1f5-4787-b38e-5cc2d75471af"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:2a607c47-22ce-4c55-a343-d2a796f83340; Quantity:38; Document:НАКЛ-2026-05-0008; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-05-14T16:04:00")
},
{
  _id: UUID("f474ccb3-0e43-4c09-9226-45d256879fde"),
  LogID: UUID("f474ccb3-0e43-4c09-9226-45d256879fde"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:09e6517b-76ef-47f7-9146-36f700f88130; Quantity:49; Document:ЗКП-2026-05-0009; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-05-17T13:24:00")
},
{
  _id: UUID("9222a742-7ccb-4d40-b1fa-e3349ee12b45"),
  LogID: UUID("9222a742-7ccb-4d40-b1fa-e3349ee12b45"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:53f8516a-52bf-4405-a8a8-3e4287741999; Quantity:34; Document:УПД-2026-05-0010; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-05-16T12:19:00")
},
{
  _id: UUID("14421227-ca3c-4d39-b63e-838c8f524f32"),
  LogID: UUID("14421227-ca3c-4d39-b63e-838c8f524f32"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:09e6517b-76ef-47f7-9146-36f700f88130; Quantity:49; Document:НАКЛ-2026-05-0011; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-05-19T11:24:00")
},
{
  _id: UUID("338cf97e-3409-425e-8a39-5a86c5232225"),
  LogID: UUID("338cf97e-3409-425e-8a39-5a86c5232225"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:c8e1a728-3c7b-418e-b6b6-d47c020c7e89; Quantity:50; Document:ЗКП-2026-05-0012; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-05-21T17:44:00")
},
{
  _id: UUID("20c4bff1-3957-403e-8bcd-c42b63df8f72"),
  LogID: UUID("20c4bff1-3957-403e-8bcd-c42b63df8f72"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:ad2b5949-7eeb-4134-8d37-b94f5df3d16e; Quantity:60; Document:УПД-2026-05-0013; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-05-26T11:54:00")
},
{
  _id: UUID("297deaeb-03c7-4cad-9719-9da20c8c8906"),
  LogID: UUID("297deaeb-03c7-4cad-9719-9da20c8c8906"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:8d8ae379-33ac-4d52-bfe7-d359961c705b; Quantity:13; Document:НАКЛ-2026-05-0014; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-05-26T14:54:00")
},
{
  _id: UUID("6520dfe5-f961-454a-a3c7-c57a4a05d030"),
  LogID: UUID("6520dfe5-f961-454a-a3c7-c57a4a05d030"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:c4b76baa-9170-47ba-b682-727c91016912; Quantity:61; Document:ЗКП-2026-05-0015; WarehouseID:22c9686f-0a0f-4684-96f6-bc2faa92ec48;",
  DateTime: ISODate("2026-05-27T08:49:00")
},
{
  _id: UUID("c6dfb5cd-0023-4692-a3fc-0cbee92ce42a"),
  LogID: UUID("c6dfb5cd-0023-4692-a3fc-0cbee92ce42a"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:64116e89-948c-4d6c-b3bd-68596681c3e5; Quantity:20; Document:УПД-2026-05-0016; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-05-31T09:54:00")
},
{
  _id: UUID("895817b9-e7f4-4102-9540-a5172b9cd6e3"),
  LogID: UUID("895817b9-e7f4-4102-9540-a5172b9cd6e3"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:81c172b6-078a-4285-a04e-f884c550d0f2; Quantity:27; Document:УПД-2026-06-0001; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-06-01T12:04:00")
},
{
  _id: UUID("bdf82435-47b0-4239-9c46-6e8aa632220f"),
  LogID: UUID("bdf82435-47b0-4239-9c46-6e8aa632220f"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:64116e89-948c-4d6c-b3bd-68596681c3e5; Quantity:36; Document:НАКЛ-2026-06-0002; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-06-02T10:49:00")
},
{
  _id: UUID("88211af7-f42b-4d75-8e41-1a7214fcb358"),
  LogID: UUID("88211af7-f42b-4d75-8e41-1a7214fcb358"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:64116e89-948c-4d6c-b3bd-68596681c3e5; Quantity:19; Document:ЗКП-2026-06-0003; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-06-01T11:44:00")
},
{
  _id: UUID("bab8eb0c-7390-4059-b48a-1848cfb09a16"),
  LogID: UUID("bab8eb0c-7390-4059-b48a-1848cfb09a16"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:c8e1a728-3c7b-418e-b6b6-d47c020c7e89; Quantity:15; Document:УПД-2026-06-0004; WarehouseID:9436a683-9fd0-46f8-be35-6bf9c0801daf;",
  DateTime: ISODate("2026-06-02T16:24:00")
},
{
  _id: UUID("a2cbe3fd-2a80-4f25-997d-89ead4900714"),
  LogID: UUID("a2cbe3fd-2a80-4f25-997d-89ead4900714"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ПРИХОД ТОВАРА",
  ActionType: "CREATE",
  LogDetails: "Registered purchase receipt; ProductID:186409f6-2ac4-44d3-8eae-020eff6bf57c; Quantity:42; Document:НАКЛ-2026-06-0005; WarehouseID:98ef1f3f-00ce-437d-b409-7d2c486f6dff;",
  DateTime: ISODate("2026-06-05T08:14:00")
},
{
  _id: UUID("6253b7c8-d73e-4b66-affc-6dd3a29fb926"),
  LogID: UUID("6253b7c8-d73e-4b66-affc-6dd3a29fb926"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:c72b436e-c2b3-4f86-8a13-74d6456d4d32; ExternalOrderNumber:WEB-202602-10000; IsOnlineOrder:true; Total:7950;",
  DateTime: ISODate("2026-02-02T10:48:00")
},
{
  _id: UUID("3bd7f6c5-cb46-45d4-afa1-049750967858"),
  LogID: UUID("3bd7f6c5-cb46-45d4-afa1-049750967858"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:bc9753ed-d7a1-4cb7-adf5-d2adc372a80c; ExternalOrderNumber:SHOP-202602-10001; IsOnlineOrder:false; Total:6050;",
  DateTime: ISODate("2026-02-04T16:51:00")
},
{
  _id: UUID("bdd38f3a-2d09-416c-ae04-ca054b70ae51"),
  LogID: UUID("bdd38f3a-2d09-416c-ae04-ca054b70ae51"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:b6bd15f4-30ae-4185-a43b-44deca17d1f3; ExternalOrderNumber:WEB-202602-10002; IsOnlineOrder:true; Total:2980;",
  DateTime: ISODate("2026-02-02T16:22:00")
},
{
  _id: UUID("ee9f2ba9-627c-405b-b382-70a316d9ded1"),
  LogID: UUID("ee9f2ba9-627c-405b-b382-70a316d9ded1"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:2dff08be-2787-4083-851e-8c8cbd891f38; ExternalOrderNumber:WEB-202602-10003; IsOnlineOrder:true; Total:3170;",
  DateTime: ISODate("2026-02-05T13:03:00")
},
{
  _id: UUID("7da08d44-35b7-46ee-8958-1b27c340e424"),
  LogID: UUID("7da08d44-35b7-46ee-8958-1b27c340e424"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:0b43d5fa-0d08-4147-b1b1-d64711cd3b77; ExternalOrderNumber:WEB-202602-10004; IsOnlineOrder:true; Total:5980;",
  DateTime: ISODate("2026-02-07T16:46:00")
},
{
  _id: UUID("487bcaca-5bb8-4e31-a483-0651ff81e9a9"),
  LogID: UUID("487bcaca-5bb8-4e31-a483-0651ff81e9a9"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:d6f1db1b-aa70-47e1-a60e-be11699a2efc; ExternalOrderNumber:SHOP-202602-10005; IsOnlineOrder:false; Total:2190;",
  DateTime: ISODate("2026-02-11T10:51:00")
},
{
  _id: UUID("bb162176-75dc-418a-bd17-363d56ddd479"),
  LogID: UUID("bb162176-75dc-418a-bd17-363d56ddd479"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:32187d38-d1d6-447e-958d-b3a2fbc45540; ExternalOrderNumber:WEB-202602-10006; IsOnlineOrder:true; Total:1360;",
  DateTime: ISODate("2026-02-12T10:17:00")
},
{
  _id: UUID("64ab3854-5238-43b5-9b3d-84b4fd92f478"),
  LogID: UUID("64ab3854-5238-43b5-9b3d-84b4fd92f478"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:6513ee1d-f177-4e61-aaf9-845041207c7c; ExternalOrderNumber:WEB-202602-10007; IsOnlineOrder:true; Total:1580;",
  DateTime: ISODate("2026-02-14T19:38:00")
},
{
  _id: UUID("e11dd216-03ab-465f-8f59-4808503ca5d5"),
  LogID: UUID("e11dd216-03ab-465f-8f59-4808503ca5d5"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:564deb05-5823-41e8-9c30-47f3c53ce5ea; ExternalOrderNumber:WEB-202602-10008; IsOnlineOrder:true; Total:2700;",
  DateTime: ISODate("2026-02-11T10:54:00")
},
{
  _id: UUID("077c8630-6e2c-4500-86c0-219d2c3e8e6b"),
  LogID: UUID("077c8630-6e2c-4500-86c0-219d2c3e8e6b"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:2c055f2f-730d-4c1d-887e-38e0737c1aa9; ExternalOrderNumber:SHOP-202602-10009; IsOnlineOrder:false; Total:2520;",
  DateTime: ISODate("2026-02-13T09:53:00")
},
{
  _id: UUID("a25afe6c-2c51-48f5-bb05-28f64f39e7ec"),
  LogID: UUID("a25afe6c-2c51-48f5-bb05-28f64f39e7ec"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:eb2ac074-b869-45ba-9f0f-a807f318b425; ExternalOrderNumber:WEB-202602-10010; IsOnlineOrder:true; Total:1180;",
  DateTime: ISODate("2026-02-17T12:47:00")
},
{
  _id: UUID("40c72b70-eb25-4fb1-86d6-5918b007785e"),
  LogID: UUID("40c72b70-eb25-4fb1-86d6-5918b007785e"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:3aac6bbb-afa1-455b-919b-c5b520646f37; ExternalOrderNumber:SHOP-202602-10011; IsOnlineOrder:false; Total:6410;",
  DateTime: ISODate("2026-02-17T17:03:00")
},
{
  _id: UUID("4c427f37-f18b-492e-bcf7-6225885a82e2"),
  LogID: UUID("4c427f37-f18b-492e-bcf7-6225885a82e2"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:58b47ff6-48d5-438a-9572-21cba51e3f13; ExternalOrderNumber:WEB-202602-10012; IsOnlineOrder:true; Total:680;",
  DateTime: ISODate("2026-02-18T17:54:00")
},
{
  _id: UUID("23098e74-b1a1-4f84-9e18-3bab50e28ec6"),
  LogID: UUID("23098e74-b1a1-4f84-9e18-3bab50e28ec6"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:28dcd142-cb7a-4f14-a093-a32d247ebb5e; ExternalOrderNumber:SHOP-202602-10013; IsOnlineOrder:false; Total:5490;",
  DateTime: ISODate("2026-02-23T18:33:00")
},
{
  _id: UUID("c8e8bded-4da6-43ef-9cb9-fc81db28012c"),
  LogID: UUID("c8e8bded-4da6-43ef-9cb9-fc81db28012c"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:a34cc425-0a71-4ef1-8a95-41071c6ad8e6; ExternalOrderNumber:WEB-202602-10014; IsOnlineOrder:true; Total:2200;",
  DateTime: ISODate("2026-02-24T17:06:00")
},
{
  _id: UUID("153f297b-3aba-4da8-8feb-28b1d17efeea"),
  LogID: UUID("153f297b-3aba-4da8-8feb-28b1d17efeea"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:d17cbddd-bf8e-4c0a-90be-18197c1e34b8; ExternalOrderNumber:WEB-202602-10015; IsOnlineOrder:true; Total:4380;",
  DateTime: ISODate("2026-02-25T19:12:00")
},
{
  _id: UUID("f0e3abef-57e7-4c76-b8fa-ee2ffe9193a9"),
  LogID: UUID("f0e3abef-57e7-4c76-b8fa-ee2ffe9193a9"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:e9ff6193-ef1c-4750-bc94-564116b714f1; ExternalOrderNumber:WEB-202602-10016; IsOnlineOrder:true; Total:5200;",
  DateTime: ISODate("2026-02-24T16:49:00")
},
{
  _id: UUID("b1117134-e4e9-41ee-adf2-56f6c6fc6d61"),
  LogID: UUID("b1117134-e4e9-41ee-adf2-56f6c6fc6d61"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:72538ed9-3b15-48f9-bb3f-3418a451bd4f; ExternalOrderNumber:SHOP-202602-10017; IsOnlineOrder:false; Total:3540;",
  DateTime: ISODate("2026-02-26T11:38:00")
},
{
  _id: UUID("18b77b3e-e705-4fd8-ad10-04910d5f345a"),
  LogID: UUID("18b77b3e-e705-4fd8-ad10-04910d5f345a"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:6bafebe0-89d7-4c1a-9626-4ad1bac4f223; ExternalOrderNumber:SHOP-202603-10018; IsOnlineOrder:false; Total:17160;",
  DateTime: ISODate("2026-03-03T12:18:00")
},
{
  _id: UUID("1406658a-b418-4f3d-bc9d-f366221f5085"),
  LogID: UUID("1406658a-b418-4f3d-bc9d-f366221f5085"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:970fa3b6-36f2-436c-82ae-a0c532775b32; ExternalOrderNumber:SHOP-202603-10019; IsOnlineOrder:false; Total:7350;",
  DateTime: ISODate("2026-03-03T18:52:00")
},
{
  _id: UUID("62ee452b-774d-498a-98e3-0d0b95888245"),
  LogID: UUID("62ee452b-774d-498a-98e3-0d0b95888245"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:6b45579a-e401-4861-a37f-84d1b1b3896f; ExternalOrderNumber:WEB-202603-10020; IsOnlineOrder:true; Total:2190;",
  DateTime: ISODate("2026-03-02T17:35:00")
},
{
  _id: UUID("723a3cec-5f36-43c3-baa9-3535d5a25562"),
  LogID: UUID("723a3cec-5f36-43c3-baa9-3535d5a25562"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:8e803803-fa04-409e-8ec4-478a0d11e68e; ExternalOrderNumber:WEB-202603-10021; IsOnlineOrder:true; Total:25420;",
  DateTime: ISODate("2026-03-03T19:56:00")
},
{
  _id: UUID("5379d00e-56eb-43cf-a740-a4e1f25880d1"),
  LogID: UUID("5379d00e-56eb-43cf-a740-a4e1f25880d1"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:66b29d47-0c78-4a43-8741-fc0eaeeb546a; ExternalOrderNumber:SHOP-202603-10022; IsOnlineOrder:false; Total:1990;",
  DateTime: ISODate("2026-03-06T10:22:00")
},
{
  _id: UUID("508d99a7-bf0d-46a4-a99a-f2bc475e596a"),
  LogID: UUID("508d99a7-bf0d-46a4-a99a-f2bc475e596a"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:912dae00-626e-468e-b0ee-19bc6e33bdf6; ExternalOrderNumber:WEB-202603-10023; IsOnlineOrder:true; Total:3790;",
  DateTime: ISODate("2026-03-05T16:04:00")
},
{
  _id: UUID("979cafd2-38ab-4cee-94ad-afd1c5f394eb"),
  LogID: UUID("979cafd2-38ab-4cee-94ad-afd1c5f394eb"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:e47c3d88-a445-4bae-8c91-9f7357db7984; ExternalOrderNumber:WEB-202603-10024; IsOnlineOrder:true; Total:3490;",
  DateTime: ISODate("2026-03-04T12:21:00")
},
{
  _id: UUID("b4ff3ee8-df66-4899-97ea-4a9b91303bcd"),
  LogID: UUID("b4ff3ee8-df66-4899-97ea-4a9b91303bcd"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:2841ba18-4f7b-48ef-a6ab-a8a5a60f6fd2; ExternalOrderNumber:SHOP-202603-10025; IsOnlineOrder:false; Total:5490;",
  DateTime: ISODate("2026-03-06T11:52:00")
},
{
  _id: UUID("38816918-ae8d-4d7b-a9b2-8b2c809722f6"),
  LogID: UUID("38816918-ae8d-4d7b-a9b2-8b2c809722f6"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:36e325d2-a436-4bfa-8615-e49511a52b6d; ExternalOrderNumber:WEB-202603-10026; IsOnlineOrder:true; Total:7650;",
  DateTime: ISODate("2026-03-06T15:53:00")
},
{
  _id: UUID("c9939936-aec0-4ee1-ace5-abd3c821c457"),
  LogID: UUID("c9939936-aec0-4ee1-ace5-abd3c821c457"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:81048032-32f1-4c29-b2e8-baec46d6f5b4; ExternalOrderNumber:WEB-202603-10027; IsOnlineOrder:true; Total:5790;",
  DateTime: ISODate("2026-03-06T09:05:00")
},
{
  _id: UUID("9de8cc00-f30f-45e8-9350-1e182fec9b1d"),
  LogID: UUID("9de8cc00-f30f-45e8-9350-1e182fec9b1d"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:88d6b780-a3ae-45a2-ab1a-748c98387cd4; ExternalOrderNumber:WEB-202603-10028; IsOnlineOrder:true; Total:6960;",
  DateTime: ISODate("2026-03-08T16:17:00")
},
{
  _id: UUID("76df9fd5-bc6c-449e-b1e8-3e09d4e2fe8d"),
  LogID: UUID("76df9fd5-bc6c-449e-b1e8-3e09d4e2fe8d"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:ab21bad6-1ab1-4942-8f0f-c6285c6152ea; ExternalOrderNumber:WEB-202603-10029; IsOnlineOrder:true; Total:17090;",
  DateTime: ISODate("2026-03-11T12:46:00")
},
{
  _id: UUID("04411cfb-a035-4c13-bdc0-a67d0a314c96"),
  LogID: UUID("04411cfb-a035-4c13-bdc0-a67d0a314c96"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:c74623a9-8b6e-446d-a52a-9ec6dc82bccc; ExternalOrderNumber:SHOP-202603-10030; IsOnlineOrder:false; Total:790;",
  DateTime: ISODate("2026-03-11T15:46:00")
},
{
  _id: UUID("f44348d4-aa06-45ff-a799-cd933c1ec2dd"),
  LogID: UUID("f44348d4-aa06-45ff-a799-cd933c1ec2dd"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:a822c162-b7e7-4980-8930-e8c2cc9053ad; ExternalOrderNumber:WEB-202603-10031; IsOnlineOrder:true; Total:4330;",
  DateTime: ISODate("2026-03-09T11:05:00")
},
{
  _id: UUID("ee0131f8-02ea-4e14-afd1-4d1c1a440602"),
  LogID: UUID("ee0131f8-02ea-4e14-afd1-4d1c1a440602"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:0ac768f4-a4cc-4233-b4fd-52de91eae985; ExternalOrderNumber:WEB-202603-10032; IsOnlineOrder:true; Total:1100;",
  DateTime: ISODate("2026-03-14T16:14:00")
},
{
  _id: UUID("9ba71831-5450-4bdc-a714-3a0c64e74fb1"),
  LogID: UUID("9ba71831-5450-4bdc-a714-3a0c64e74fb1"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:cb63c10a-fd66-4b0f-a3a5-e993fae5564a; ExternalOrderNumber:SHOP-202603-10033; IsOnlineOrder:false; Total:1990;",
  DateTime: ISODate("2026-03-13T17:50:00")
},
{
  _id: UUID("9f57df42-57fd-4727-885b-6e623b1d1f17"),
  LogID: UUID("9f57df42-57fd-4727-885b-6e623b1d1f17"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:00636bad-9e10-43dd-96ba-3e901211d0a9; ExternalOrderNumber:SHOP-202603-10034; IsOnlineOrder:false; Total:790;",
  DateTime: ISODate("2026-03-14T12:28:00")
},
{
  _id: UUID("f46a4cc8-6c86-476c-9049-11d60fffbfd6"),
  LogID: UUID("f46a4cc8-6c86-476c-9049-11d60fffbfd6"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:a8679c74-218e-427d-a93e-d10a329600ec; ExternalOrderNumber:WEB-202603-10035; IsOnlineOrder:true; Total:3830;",
  DateTime: ISODate("2026-03-15T15:24:00")
},
{
  _id: UUID("df60bc61-e796-4ec4-a53a-b810b6b2c509"),
  LogID: UUID("df60bc61-e796-4ec4-a53a-b810b6b2c509"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:55bf3a1f-ee4e-45f3-a0a7-5f0bd066c7ac; ExternalOrderNumber:WEB-202603-10036; IsOnlineOrder:true; Total:6190;",
  DateTime: ISODate("2026-03-16T14:57:00")
},
{
  _id: UUID("1a619021-fa4d-4827-a658-c2c0647b575c"),
  LogID: UUID("1a619021-fa4d-4827-a658-c2c0647b575c"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:fa866c3c-9751-410f-9a7a-180d4edc41fe; ExternalOrderNumber:SHOP-202603-10037; IsOnlineOrder:false; Total:13960;",
  DateTime: ISODate("2026-03-15T09:25:00")
},
{
  _id: UUID("1b5026c0-d1dc-4076-bd04-b9d27ae65c70"),
  LogID: UUID("1b5026c0-d1dc-4076-bd04-b9d27ae65c70"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:8c646b55-8a91-4dda-857c-533514ef551b; ExternalOrderNumber:WEB-202603-10038; IsOnlineOrder:true; Total:2770;",
  DateTime: ISODate("2026-03-16T12:53:00")
},
{
  _id: UUID("3af80fb3-45fc-4145-a658-fca3d6171807"),
  LogID: UUID("3af80fb3-45fc-4145-a658-fca3d6171807"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:92b833a7-d54b-49e9-9213-98d327d54f09; ExternalOrderNumber:WEB-202603-10039; IsOnlineOrder:true; Total:1470;",
  DateTime: ISODate("2026-03-20T09:37:00")
},
{
  _id: UUID("7f88263d-4b88-4641-8223-d53f70b9aa3f"),
  LogID: UUID("7f88263d-4b88-4641-8223-d53f70b9aa3f"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:31456baa-8591-4f91-a9b0-eaf7e1f7377c; ExternalOrderNumber:SHOP-202603-10040; IsOnlineOrder:false; Total:1970;",
  DateTime: ISODate("2026-03-21T11:52:00")
},
{
  _id: UUID("b91c782c-e964-4d77-82bb-807e68ba01cc"),
  LogID: UUID("b91c782c-e964-4d77-82bb-807e68ba01cc"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:35421669-9eed-48f1-98b7-1ad8fbf184dc; ExternalOrderNumber:WEB-202603-10041; IsOnlineOrder:true; Total:680;",
  DateTime: ISODate("2026-03-18T15:37:00")
},
{
  _id: UUID("95a02493-81bd-4140-97bf-b86df81e1082"),
  LogID: UUID("95a02493-81bd-4140-97bf-b86df81e1082"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:271e9bac-d5d3-4779-9560-560cf5b0c5cf; ExternalOrderNumber:WEB-202603-10042; IsOnlineOrder:true; Total:3110;",
  DateTime: ISODate("2026-03-22T12:24:00")
},
{
  _id: UUID("d0eb1298-c570-4537-90f7-a20fe8ef2ef9"),
  LogID: UUID("d0eb1298-c570-4537-90f7-a20fe8ef2ef9"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:a9933afb-b82c-430f-9c94-ff4ef086fa6b; ExternalOrderNumber:SHOP-202603-10043; IsOnlineOrder:false; Total:5490;",
  DateTime: ISODate("2026-03-23T16:18:00")
},
{
  _id: UUID("a60ace16-2392-4eeb-84b7-f4cb6d15bf14"),
  LogID: UUID("a60ace16-2392-4eeb-84b7-f4cb6d15bf14"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:71e1feab-c186-429f-ae33-7b273337afd3; ExternalOrderNumber:WEB-202603-10044; IsOnlineOrder:true; Total:920;",
  DateTime: ISODate("2026-03-22T17:43:00")
},
{
  _id: UUID("40ceaa4d-21e6-4d21-a60e-9c518c1736df"),
  LogID: UUID("40ceaa4d-21e6-4d21-a60e-9c518c1736df"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:7b947164-1991-4eda-a8d7-fe4edfce80c1; ExternalOrderNumber:SHOP-202603-10045; IsOnlineOrder:false; Total:6530;",
  DateTime: ISODate("2026-03-23T10:51:00")
},
{
  _id: UUID("65131f38-a2a1-43f7-975f-405957840830"),
  LogID: UUID("65131f38-a2a1-43f7-975f-405957840830"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:3903bc70-dbf2-4e92-9d16-5c48263da70e; ExternalOrderNumber:WEB-202603-10046; IsOnlineOrder:true; Total:4410;",
  DateTime: ISODate("2026-03-22T15:02:00")
},
{
  _id: UUID("d8450448-5802-4a53-9a4f-7a1f7489406f"),
  LogID: UUID("d8450448-5802-4a53-9a4f-7a1f7489406f"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:e941b9d5-9825-4a6d-b804-29a7e67a2a6e; ExternalOrderNumber:WEB-202603-10047; IsOnlineOrder:true; Total:5300;",
  DateTime: ISODate("2026-03-26T10:28:00")
},
{
  _id: UUID("6a2d54fb-2099-483b-aade-d8a722515626"),
  LogID: UUID("6a2d54fb-2099-483b-aade-d8a722515626"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:80f935ef-6f63-4dc6-8526-f61e14bef793; ExternalOrderNumber:SHOP-202603-10048; IsOnlineOrder:false; Total:310;",
  DateTime: ISODate("2026-03-26T17:55:00")
},
{
  _id: UUID("34b6e85a-b6f1-4bb9-a455-09072fb00809"),
  LogID: UUID("34b6e85a-b6f1-4bb9-a455-09072fb00809"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:a43dd195-64f1-4223-a728-786250d8d730; ExternalOrderNumber:SHOP-202603-10049; IsOnlineOrder:false; Total:680;",
  DateTime: ISODate("2026-03-24T10:16:00")
},
{
  _id: UUID("69ce3697-8d95-4542-9514-8cb3a710d1d3"),
  LogID: UUID("69ce3697-8d95-4542-9514-8cb3a710d1d3"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:9d29d03a-a9d9-4e02-86d5-e8cc2639bcae; ExternalOrderNumber:WEB-202603-10050; IsOnlineOrder:true; Total:2960;",
  DateTime: ISODate("2026-03-27T17:41:00")
},
{
  _id: UUID("9a81cfb9-3093-4ad6-98cd-73766c188b4c"),
  LogID: UUID("9a81cfb9-3093-4ad6-98cd-73766c188b4c"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:47d3fce7-f86d-43ed-b35e-64705539cc7f; ExternalOrderNumber:WEB-202603-10051; IsOnlineOrder:true; Total:5130;",
  DateTime: ISODate("2026-03-26T17:51:00")
},
{
  _id: UUID("2d2acf34-521b-4964-b7e4-900ca6289cdc"),
  LogID: UUID("2d2acf34-521b-4964-b7e4-900ca6289cdc"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:ac462906-e1b7-446a-a52d-c613f2acaf9d; ExternalOrderNumber:WEB-202603-10052; IsOnlineOrder:true; Total:3760;",
  DateTime: ISODate("2026-03-26T17:48:00")
},
{
  _id: UUID("de2e0e32-094b-42a9-9445-4b0cfa7b6b71"),
  LogID: UUID("de2e0e32-094b-42a9-9445-4b0cfa7b6b71"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:be515ce6-d382-4b14-9be6-14ad18e022d3; ExternalOrderNumber:SHOP-202603-10053; IsOnlineOrder:false; Total:2650;",
  DateTime: ISODate("2026-03-31T11:56:00")
},
{
  _id: UUID("4fc63e96-d72e-4134-8f6c-7440c6786a06"),
  LogID: UUID("4fc63e96-d72e-4134-8f6c-7440c6786a06"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:9a72eb0b-7496-4071-8e6d-d1ea6ad86356; ExternalOrderNumber:WEB-202603-10054; IsOnlineOrder:true; Total:10140;",
  DateTime: ISODate("2026-03-30T17:46:00")
},
{
  _id: UUID("f24cdc5c-3ee1-4b11-964b-8b359fff9f6f"),
  LogID: UUID("f24cdc5c-3ee1-4b11-964b-8b359fff9f6f"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:1fffe321-44c7-4ffd-bfb3-86b0f9e740b4; ExternalOrderNumber:WEB-202604-10055; IsOnlineOrder:true; Total:560;",
  DateTime: ISODate("2026-04-01T17:38:00")
},
{
  _id: UUID("d1c84ea7-6514-4eda-842b-6be25160f10b"),
  LogID: UUID("d1c84ea7-6514-4eda-842b-6be25160f10b"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:e5bd84dc-844e-47ec-a2ea-2e15cc5a45f5; ExternalOrderNumber:SHOP-202604-10056; IsOnlineOrder:false; Total:4780;",
  DateTime: ISODate("2026-04-04T16:33:00")
},
{
  _id: UUID("730d1d13-ed9c-44f1-8263-6cb94b39e80b"),
  LogID: UUID("730d1d13-ed9c-44f1-8263-6cb94b39e80b"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:28a3d54e-c2f3-4fca-a63c-3a0f190789ad; ExternalOrderNumber:WEB-202604-10057; IsOnlineOrder:true; Total:5880;",
  DateTime: ISODate("2026-04-02T12:23:00")
},
{
  _id: UUID("f8b53d8e-0282-410d-a3cb-0fcc37acfa13"),
  LogID: UUID("f8b53d8e-0282-410d-a3cb-0fcc37acfa13"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:424cc51d-faad-4fd4-8265-c6a7843456a0; ExternalOrderNumber:WEB-202604-10058; IsOnlineOrder:true; Total:1840;",
  DateTime: ISODate("2026-04-03T16:51:00")
},
{
  _id: UUID("26b4410f-73e5-4f72-af5d-c8da19086a21"),
  LogID: UUID("26b4410f-73e5-4f72-af5d-c8da19086a21"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:99981bdc-9db6-4c9b-89fe-6bfffa68b110; ExternalOrderNumber:SHOP-202604-10059; IsOnlineOrder:false; Total:4780;",
  DateTime: ISODate("2026-04-08T13:37:00")
},
{
  _id: UUID("ef66f62b-6245-4d8e-acfe-11fdff3d0df8"),
  LogID: UUID("ef66f62b-6245-4d8e-acfe-11fdff3d0df8"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:abf33c72-cf25-4c77-9efb-0c5837b17514; ExternalOrderNumber:WEB-202604-10060; IsOnlineOrder:true; Total:2890;",
  DateTime: ISODate("2026-04-06T14:23:00")
},
{
  _id: UUID("05aa016e-67ec-45dd-9e1c-ca714b61209e"),
  LogID: UUID("05aa016e-67ec-45dd-9e1c-ca714b61209e"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:b24a7205-215b-4c37-8112-d6c6121f62c1; ExternalOrderNumber:WEB-202604-10061; IsOnlineOrder:true; Total:19150;",
  DateTime: ISODate("2026-04-06T16:37:00")
},
{
  _id: UUID("42723d6d-dadb-4272-9543-89b7880dd4b9"),
  LogID: UUID("42723d6d-dadb-4272-9543-89b7880dd4b9"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:846e18fc-14f1-428a-b32a-ec486c2a7623; ExternalOrderNumber:WEB-202604-10062; IsOnlineOrder:true; Total:3490;",
  DateTime: ISODate("2026-04-09T14:22:00")
},
{
  _id: UUID("c9c3649e-dc06-4f21-b14d-548671e4951c"),
  LogID: UUID("c9c3649e-dc06-4f21-b14d-548671e4951c"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:9bbb166d-4044-41e6-bcbe-30572cd2f91f; ExternalOrderNumber:SHOP-202604-10063; IsOnlineOrder:false; Total:3740;",
  DateTime: ISODate("2026-04-12T13:54:00")
},
{
  _id: UUID("1ef8cd31-e98c-4fa4-a10b-0265f402f4d5"),
  LogID: UUID("1ef8cd31-e98c-4fa4-a10b-0265f402f4d5"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:60c49087-93b1-4b0d-90de-de296882b589; ExternalOrderNumber:WEB-202604-10064; IsOnlineOrder:true; Total:5160;",
  DateTime: ISODate("2026-04-12T16:53:00")
},
{
  _id: UUID("a46b9179-3784-437c-b367-f0bd2dbe943c"),
  LogID: UUID("a46b9179-3784-437c-b367-f0bd2dbe943c"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:f69ab3da-36fe-4738-847d-de5a09717b42; ExternalOrderNumber:SHOP-202604-10065; IsOnlineOrder:false; Total:9200;",
  DateTime: ISODate("2026-04-13T16:12:00")
},
{
  _id: UUID("6b33d68d-ac62-4b72-b641-127e864d7dde"),
  LogID: UUID("6b33d68d-ac62-4b72-b641-127e864d7dde"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:538114f6-b562-48c0-b2ce-b9c30a5ea56d; ExternalOrderNumber:SHOP-202604-10066; IsOnlineOrder:false; Total:9660;",
  DateTime: ISODate("2026-04-14T14:52:00")
},
{
  _id: UUID("e7efa57e-8175-4369-85f2-56f2f220ced6"),
  LogID: UUID("e7efa57e-8175-4369-85f2-56f2f220ced6"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:08d675c8-025a-4cfa-accf-7c858fcfcbf7; ExternalOrderNumber:WEB-202604-10067; IsOnlineOrder:true; Total:9140;",
  DateTime: ISODate("2026-04-15T19:38:00")
},
{
  _id: UUID("b3cba2aa-b3ab-418a-9f98-c72fe3c19b58"),
  LogID: UUID("b3cba2aa-b3ab-418a-9f98-c72fe3c19b58"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:61138ed6-1b35-4334-9635-08f45361576d; ExternalOrderNumber:SHOP-202604-10068; IsOnlineOrder:false; Total:2370;",
  DateTime: ISODate("2026-04-19T11:44:00")
},
{
  _id: UUID("34211dee-d51b-474d-9a2c-82cb7a397cdd"),
  LogID: UUID("34211dee-d51b-474d-9a2c-82cb7a397cdd"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:638ada9e-002f-4b95-80ae-b2b4d1358603; ExternalOrderNumber:SHOP-202604-10069; IsOnlineOrder:false; Total:4470;",
  DateTime: ISODate("2026-04-19T13:52:00")
},
{
  _id: UUID("ad49846f-0aa6-4348-b169-75cba21b2c79"),
  LogID: UUID("ad49846f-0aa6-4348-b169-75cba21b2c79"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:14e75d90-fc01-4034-8e36-4ad933f0fc72; ExternalOrderNumber:WEB-202604-10070; IsOnlineOrder:true; Total:8580;",
  DateTime: ISODate("2026-04-19T16:21:00")
},
{
  _id: UUID("a396970d-0008-4a10-beb2-4415a2c356af"),
  LogID: UUID("a396970d-0008-4a10-beb2-4415a2c356af"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:4da1c620-42bd-4297-b1b5-c2969612e53a; ExternalOrderNumber:SHOP-202604-10071; IsOnlineOrder:false; Total:4120;",
  DateTime: ISODate("2026-04-21T11:28:00")
},
{
  _id: UUID("8d4c3b0d-0700-4b40-9cf6-6654808c32d3"),
  LogID: UUID("8d4c3b0d-0700-4b40-9cf6-6654808c32d3"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:7c15634f-62ce-4551-baef-39ab70749110; ExternalOrderNumber:WEB-202604-10072; IsOnlineOrder:true; Total:3200;",
  DateTime: ISODate("2026-04-19T14:56:00")
},
{
  _id: UUID("fa5c09a7-729d-44ca-a437-b770ed9e5c51"),
  LogID: UUID("fa5c09a7-729d-44ca-a437-b770ed9e5c51"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:fccb1c9d-3d37-4c30-a8b6-f220860e5188; ExternalOrderNumber:SHOP-202604-10073; IsOnlineOrder:false; Total:5390;",
  DateTime: ISODate("2026-04-23T14:01:00")
},
{
  _id: UUID("543be25d-28d2-4128-8048-66090df3a333"),
  LogID: UUID("543be25d-28d2-4128-8048-66090df3a333"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:cb627157-3053-4aa0-ac27-11570229c0f1; ExternalOrderNumber:WEB-202604-10074; IsOnlineOrder:true; Total:4980;",
  DateTime: ISODate("2026-04-23T12:57:00")
},
{
  _id: UUID("bc3738c5-3822-42b1-919a-e3a0d07d00ac"),
  LogID: UUID("bc3738c5-3822-42b1-919a-e3a0d07d00ac"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:e747011f-f39d-4b1e-b4a0-03391f233a3c; ExternalOrderNumber:SHOP-202604-10075; IsOnlineOrder:false; Total:8890;",
  DateTime: ISODate("2026-04-26T17:21:00")
},
{
  _id: UUID("e40696a4-c598-4202-974d-db0e747d59ba"),
  LogID: UUID("e40696a4-c598-4202-974d-db0e747d59ba"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:49957640-6d54-4c2a-9359-d914fc7e8bd9; ExternalOrderNumber:WEB-202604-10076; IsOnlineOrder:true; Total:2650;",
  DateTime: ISODate("2026-04-26T16:35:00")
},
{
  _id: UUID("7aed9a89-1882-4c4a-aa7e-56daa84bee86"),
  LogID: UUID("7aed9a89-1882-4c4a-aa7e-56daa84bee86"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:2470a601-7ad3-478b-be5a-2d380c3aebd3; ExternalOrderNumber:WEB-202604-10077; IsOnlineOrder:true; Total:680;",
  DateTime: ISODate("2026-04-27T17:08:00")
},
{
  _id: UUID("c2e7c6c7-6075-42e0-9337-a14a2ed29a85"),
  LogID: UUID("c2e7c6c7-6075-42e0-9337-a14a2ed29a85"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:127835ea-5a4d-40a8-8150-485b5774ef6b; ExternalOrderNumber:SHOP-202604-10078; IsOnlineOrder:false; Total:19130;",
  DateTime: ISODate("2026-04-30T18:22:00")
},
{
  _id: UUID("1ad38d6b-c7fd-4e1d-8fb8-dca20f2a035a"),
  LogID: UUID("1ad38d6b-c7fd-4e1d-8fb8-dca20f2a035a"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:c650bda1-1db2-45e6-a27e-ee330fdbfc1f; ExternalOrderNumber:SHOP-202605-10079; IsOnlineOrder:false; Total:2040;",
  DateTime: ISODate("2026-05-01T14:45:00")
},
{
  _id: UUID("6188af2d-f850-4624-8db8-009f9f887a8e"),
  LogID: UUID("6188af2d-f850-4624-8db8-009f9f887a8e"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:98c15f34-4bd7-4f2e-b365-74d8ee616536; ExternalOrderNumber:SHOP-202605-10080; IsOnlineOrder:false; Total:1370;",
  DateTime: ISODate("2026-05-01T12:22:00")
},
{
  _id: UUID("98ddd1e3-2c8d-4a8e-9cb6-f36e1b27f7cc"),
  LogID: UUID("98ddd1e3-2c8d-4a8e-9cb6-f36e1b27f7cc"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:98e31411-8ee9-4384-927f-41329c9ac598; ExternalOrderNumber:SHOP-202605-10081; IsOnlineOrder:false; Total:14470;",
  DateTime: ISODate("2026-05-01T09:24:00")
},
{
  _id: UUID("b497a3cc-18a7-4256-9738-887f409f99f5"),
  LogID: UUID("b497a3cc-18a7-4256-9738-887f409f99f5"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:5e3f8a27-f6b1-41ae-84c9-4cdc27cccc82; ExternalOrderNumber:SHOP-202605-10082; IsOnlineOrder:false; Total:4300;",
  DateTime: ISODate("2026-05-05T14:02:00")
},
{
  _id: UUID("2a035142-7aa4-4291-b888-fe5b91442fc7"),
  LogID: UUID("2a035142-7aa4-4291-b888-fe5b91442fc7"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:30852555-56fb-43f6-86f1-6d7392afab75; ExternalOrderNumber:WEB-202605-10083; IsOnlineOrder:true; Total:2870;",
  DateTime: ISODate("2026-05-01T12:23:00")
},
{
  _id: UUID("62f348f2-ded0-40a9-b389-8f867fbff29f"),
  LogID: UUID("62f348f2-ded0-40a9-b389-8f867fbff29f"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:03bb4049-d609-4add-8d12-a16a76b1fc1f; ExternalOrderNumber:SHOP-202605-10084; IsOnlineOrder:false; Total:8440;",
  DateTime: ISODate("2026-05-02T11:56:00")
},
{
  _id: UUID("c622d4ff-8acc-4271-ae9f-4108a15b6607"),
  LogID: UUID("c622d4ff-8acc-4271-ae9f-4108a15b6607"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:50f30f65-d066-45df-a3ca-0b3c39642d59; ExternalOrderNumber:SHOP-202605-10085; IsOnlineOrder:false; Total:7300;",
  DateTime: ISODate("2026-05-03T16:16:00")
},
{
  _id: UUID("44355799-eee5-491d-bc01-1e77cba942f2"),
  LogID: UUID("44355799-eee5-491d-bc01-1e77cba942f2"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:7a7dace2-ae08-4599-bf64-bcec020cb0cf; ExternalOrderNumber:WEB-202605-10086; IsOnlineOrder:true; Total:3980;",
  DateTime: ISODate("2026-05-05T17:31:00")
},
{
  _id: UUID("a15b1774-fc75-44d7-9452-4b21107f8a2a"),
  LogID: UUID("a15b1774-fc75-44d7-9452-4b21107f8a2a"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:c69bc1ef-8108-4fc7-9bad-ee02d468cfb8; ExternalOrderNumber:WEB-202605-10087; IsOnlineOrder:true; Total:6900;",
  DateTime: ISODate("2026-05-07T10:17:00")
},
{
  _id: UUID("b8f011d0-529b-49a7-a883-9a3d4ac57f41"),
  LogID: UUID("b8f011d0-529b-49a7-a883-9a3d4ac57f41"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:528895c5-8146-43fa-8a3b-01b565203345; ExternalOrderNumber:SHOP-202605-10088; IsOnlineOrder:false; Total:8580;",
  DateTime: ISODate("2026-05-05T11:53:00")
},
{
  _id: UUID("3eb7c276-496a-4691-b8c7-18af309dc92d"),
  LogID: UUID("3eb7c276-496a-4691-b8c7-18af309dc92d"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:f63ea85e-6d63-470a-aa54-62ec908e0044; ExternalOrderNumber:SHOP-202605-10089; IsOnlineOrder:false; Total:3970;",
  DateTime: ISODate("2026-05-09T18:01:00")
},
{
  _id: UUID("bedfba39-a942-4eba-a43e-aca345cbec6d"),
  LogID: UUID("bedfba39-a942-4eba-a43e-aca345cbec6d"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:5e80807e-e418-42cb-9b97-0c8bad5f6d00; ExternalOrderNumber:SHOP-202605-10090; IsOnlineOrder:false; Total:15700;",
  DateTime: ISODate("2026-05-10T11:06:00")
},
{
  _id: UUID("f06a06ff-2b36-44df-bf7b-08860815b5e4"),
  LogID: UUID("f06a06ff-2b36-44df-bf7b-08860815b5e4"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:7e583da2-488e-4b0c-95fd-4cea3ffe493d; ExternalOrderNumber:SHOP-202605-10091; IsOnlineOrder:false; Total:3790;",
  DateTime: ISODate("2026-05-11T18:08:00")
},
{
  _id: UUID("81eb2064-9bcd-4b35-aa7e-4c6e31f11172"),
  LogID: UUID("81eb2064-9bcd-4b35-aa7e-4c6e31f11172"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:747b7f77-10ec-4a1d-b43b-5faf204de8c4; ExternalOrderNumber:SHOP-202605-10092; IsOnlineOrder:false; Total:7550;",
  DateTime: ISODate("2026-05-08T10:21:00")
},
{
  _id: UUID("a1029f0d-90eb-40be-b9b2-af613df7d6d8"),
  LogID: UUID("a1029f0d-90eb-40be-b9b2-af613df7d6d8"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:2c55bd53-aa8b-4882-a353-b423644c0169; ExternalOrderNumber:SHOP-202605-10093; IsOnlineOrder:false; Total:2650;",
  DateTime: ISODate("2026-05-09T13:52:00")
},
{
  _id: UUID("5b43ddc9-c5cb-4c99-bfd1-266ac1b7a14c"),
  LogID: UUID("5b43ddc9-c5cb-4c99-bfd1-266ac1b7a14c"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:07e52468-31cb-4daf-8789-79d3cfd06ad6; ExternalOrderNumber:WEB-202605-10094; IsOnlineOrder:true; Total:5390;",
  DateTime: ISODate("2026-05-10T12:58:00")
},
{
  _id: UUID("bedf2084-d29d-4971-9892-88084f67cc86"),
  LogID: UUID("bedf2084-d29d-4971-9892-88084f67cc86"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:f7155c81-6cec-4335-b16a-cda6cdcd4011; ExternalOrderNumber:WEB-202605-10095; IsOnlineOrder:true; Total:1860;",
  DateTime: ISODate("2026-05-09T10:01:00")
},
{
  _id: UUID("c4955e48-e9cf-4ecf-afeb-c382088542a7"),
  LogID: UUID("c4955e48-e9cf-4ecf-afeb-c382088542a7"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:ac0e311f-40c3-4465-ba3b-f034558c4b80; ExternalOrderNumber:SHOP-202605-10096; IsOnlineOrder:false; Total:18270;",
  DateTime: ISODate("2026-05-10T18:22:00")
},
{
  _id: UUID("1aa89584-0664-48d5-b5d4-42c059e0534c"),
  LogID: UUID("1aa89584-0664-48d5-b5d4-42c059e0534c"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:eb11132c-bea5-487c-96e4-6abd8c571b9a; ExternalOrderNumber:WEB-202605-10097; IsOnlineOrder:true; Total:4430;",
  DateTime: ISODate("2026-05-12T09:22:00")
},
{
  _id: UUID("04a6b2cb-ee73-4c74-a365-b3ab404c6c2f"),
  LogID: UUID("04a6b2cb-ee73-4c74-a365-b3ab404c6c2f"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:c7df4f66-bc69-46a4-b1bc-9fa7b15d1430; ExternalOrderNumber:SHOP-202605-10098; IsOnlineOrder:false; Total:3180;",
  DateTime: ISODate("2026-05-12T11:19:00")
},
{
  _id: UUID("8c363b82-f9e6-4f64-be26-a503c5ab34b4"),
  LogID: UUID("8c363b82-f9e6-4f64-be26-a503c5ab34b4"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:d55b4f75-7289-45ad-b94e-b1679b0eacc6; ExternalOrderNumber:WEB-202605-10099; IsOnlineOrder:true; Total:1410;",
  DateTime: ISODate("2026-05-14T11:46:00")
},
{
  _id: UUID("122c0ce4-7532-458c-bb94-fff43bc12def"),
  LogID: UUID("122c0ce4-7532-458c-bb94-fff43bc12def"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:f6cfb14d-2d62-4d8d-84b6-993f92425cbd; ExternalOrderNumber:SHOP-202605-10100; IsOnlineOrder:false; Total:560;",
  DateTime: ISODate("2026-05-16T10:17:00")
},
{
  _id: UUID("1133ed29-3a9d-4c1a-b2e7-3b85413b89bc"),
  LogID: UUID("1133ed29-3a9d-4c1a-b2e7-3b85413b89bc"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:594972c3-a9eb-41ae-b0af-6e6af4947af5; ExternalOrderNumber:SHOP-202605-10101; IsOnlineOrder:false; Total:6270;",
  DateTime: ISODate("2026-05-13T17:11:00")
},
{
  _id: UUID("7f9e8d95-52a8-475e-9e76-064859de0181"),
  LogID: UUID("7f9e8d95-52a8-475e-9e76-064859de0181"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:f32b3c55-544c-49d5-9017-6750aedd3d53; ExternalOrderNumber:SHOP-202605-10102; IsOnlineOrder:false; Total:3180;",
  DateTime: ISODate("2026-05-17T18:04:00")
},
{
  _id: UUID("b1bc7f70-82b0-43f2-b55b-7a361802d6f9"),
  LogID: UUID("b1bc7f70-82b0-43f2-b55b-7a361802d6f9"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:5f0aac5f-c981-4d7d-8403-9969ae8481e1; ExternalOrderNumber:WEB-202605-10103; IsOnlineOrder:true; Total:9590;",
  DateTime: ISODate("2026-05-14T17:21:00")
},
{
  _id: UUID("cc1daee4-b6c0-4f3d-aa9c-37835917c9e6"),
  LogID: UUID("cc1daee4-b6c0-4f3d-aa9c-37835917c9e6"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:9d43c63e-5feb-4968-8350-7fd4164968b0; ExternalOrderNumber:WEB-202605-10104; IsOnlineOrder:true; Total:2150;",
  DateTime: ISODate("2026-05-19T15:47:00")
},
{
  _id: UUID("b375faa6-da67-40ec-824e-91dad2c7bc64"),
  LogID: UUID("b375faa6-da67-40ec-824e-91dad2c7bc64"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:6906e733-9798-4f22-a63c-5ccc0ed3df8c; ExternalOrderNumber:WEB-202605-10105; IsOnlineOrder:true; Total:12290;",
  DateTime: ISODate("2026-05-20T11:55:00")
},
{
  _id: UUID("72f34e12-56f1-4ebb-a09a-4d81a2f0515d"),
  LogID: UUID("72f34e12-56f1-4ebb-a09a-4d81a2f0515d"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:5959c5ba-2c97-4424-8761-a491d99e0363; ExternalOrderNumber:WEB-202605-10106; IsOnlineOrder:true; Total:2950;",
  DateTime: ISODate("2026-05-20T15:31:00")
},
{
  _id: UUID("cf4081f7-cb24-4548-bddb-981f31fedb5b"),
  LogID: UUID("cf4081f7-cb24-4548-bddb-981f31fedb5b"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:011ab2c6-d1f5-4a38-81a5-59d1c9c0e84a; ExternalOrderNumber:WEB-202605-10107; IsOnlineOrder:true; Total:9720;",
  DateTime: ISODate("2026-05-17T16:57:00")
},
{
  _id: UUID("44615073-0a30-41a4-80ad-9ccf511600b3"),
  LogID: UUID("44615073-0a30-41a4-80ad-9ccf511600b3"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:42dbc97f-004c-4692-8af7-05bd295900d9; ExternalOrderNumber:WEB-202605-10108; IsOnlineOrder:true; Total:680;",
  DateTime: ISODate("2026-05-21T13:51:00")
},
{
  _id: UUID("156d1c5a-5361-46a1-9e37-210ae987afb1"),
  LogID: UUID("156d1c5a-5361-46a1-9e37-210ae987afb1"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:804b749f-b445-4388-af4d-87dc707899f5; ExternalOrderNumber:SHOP-202605-10109; IsOnlineOrder:false; Total:7580;",
  DateTime: ISODate("2026-05-20T19:26:00")
},
{
  _id: UUID("533cbde4-441e-4c01-8cf7-52515c0c71f0"),
  LogID: UUID("533cbde4-441e-4c01-8cf7-52515c0c71f0"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:432f499c-296c-4edb-8e81-90f7df22af5f; ExternalOrderNumber:SHOP-202605-10110; IsOnlineOrder:false; Total:11330;",
  DateTime: ISODate("2026-05-20T14:56:00")
},
{
  _id: UUID("d7a20785-e99d-4d8e-b906-8db01b35e46e"),
  LogID: UUID("d7a20785-e99d-4d8e-b906-8db01b35e46e"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:c807d98f-aa9e-485e-8256-fa92b8eb2a5b; ExternalOrderNumber:WEB-202605-10111; IsOnlineOrder:true; Total:15210;",
  DateTime: ISODate("2026-05-23T17:42:00")
},
{
  _id: UUID("475b0c16-bebf-4ca2-8b13-d1c5a5804f25"),
  LogID: UUID("475b0c16-bebf-4ca2-8b13-d1c5a5804f25"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:bd353f63-86cf-49ef-acdd-b49e7c12c52b; ExternalOrderNumber:SHOP-202605-10112; IsOnlineOrder:false; Total:8520;",
  DateTime: ISODate("2026-05-21T18:08:00")
},
{
  _id: UUID("7ba796ab-1676-4c46-a541-7d3f1501a4b0"),
  LogID: UUID("7ba796ab-1676-4c46-a541-7d3f1501a4b0"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:032911b1-0f8a-40a6-ba29-cb6bc6d8b19d; ExternalOrderNumber:WEB-202605-10113; IsOnlineOrder:true; Total:5470;",
  DateTime: ISODate("2026-05-25T18:23:00")
},
{
  _id: UUID("5a89c9d0-8137-412c-bdcf-946a5b69e6e4"),
  LogID: UUID("5a89c9d0-8137-412c-bdcf-946a5b69e6e4"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:eab6bd66-088d-4703-ba54-fe5b41ff06c6; ExternalOrderNumber:WEB-202605-10114; IsOnlineOrder:true; Total:7460;",
  DateTime: ISODate("2026-05-24T12:34:00")
},
{
  _id: UUID("0ec4fb7b-9e20-4fe6-abaf-af35e184e3ed"),
  LogID: UUID("0ec4fb7b-9e20-4fe6-abaf-af35e184e3ed"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:18090156-a980-4c94-ab12-f2e0d127f9c6; ExternalOrderNumber:SHOP-202605-10115; IsOnlineOrder:false; Total:19960;",
  DateTime: ISODate("2026-05-26T14:48:00")
},
{
  _id: UUID("76cfbbb7-b80a-4ae9-a6d4-cedafda3e6d2"),
  LogID: UUID("76cfbbb7-b80a-4ae9-a6d4-cedafda3e6d2"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:7a9d0ec2-160e-4cf4-9902-51ea06f393e5; ExternalOrderNumber:WEB-202605-10116; IsOnlineOrder:true; Total:4730;",
  DateTime: ISODate("2026-05-23T11:55:00")
},
{
  _id: UUID("1f626906-33f4-48a7-acc0-e5928eddc97f"),
  LogID: UUID("1f626906-33f4-48a7-acc0-e5928eddc97f"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:040ba320-893d-4647-89b7-b644a8f05b94; ExternalOrderNumber:WEB-202605-10117; IsOnlineOrder:true; Total:8490;",
  DateTime: ISODate("2026-05-28T19:56:00")
},
{
  _id: UUID("900b244a-46c9-4265-9744-a7e3402662b8"),
  LogID: UUID("900b244a-46c9-4265-9744-a7e3402662b8"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:62b931e5-a13c-48e7-a252-b495229100a0; ExternalOrderNumber:WEB-202605-10118; IsOnlineOrder:true; Total:2390;",
  DateTime: ISODate("2026-05-27T15:46:00")
},
{
  _id: UUID("2a50fb04-4ee2-4c6e-a1b2-1ef50729a30c"),
  LogID: UUID("2a50fb04-4ee2-4c6e-a1b2-1ef50729a30c"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:8869f692-6e0b-4baf-b8ae-d01ebd3506d6; ExternalOrderNumber:SHOP-202605-10119; IsOnlineOrder:false; Total:29810;",
  DateTime: ISODate("2026-05-25T15:19:00")
},
{
  _id: UUID("7b0d0607-5756-4e4a-a1d0-9140ae166264"),
  LogID: UUID("7b0d0607-5756-4e4a-a1d0-9140ae166264"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:367f90fb-6d95-4c44-b2a8-b082590926aa; ExternalOrderNumber:WEB-202605-10120; IsOnlineOrder:true; Total:2490;",
  DateTime: ISODate("2026-05-27T13:32:00")
},
{
  _id: UUID("b92d712b-4739-4274-89a4-158cf84180fa"),
  LogID: UUID("b92d712b-4739-4274-89a4-158cf84180fa"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:63d3fdb0-1bf7-45a7-a576-01d964e76b8d; ExternalOrderNumber:WEB-202605-10121; IsOnlineOrder:true; Total:5960;",
  DateTime: ISODate("2026-05-27T15:33:00")
},
{
  _id: UUID("fb970b39-f27b-4f2b-9945-50ef575d19ec"),
  LogID: UUID("fb970b39-f27b-4f2b-9945-50ef575d19ec"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:e6189dcd-885f-47eb-a869-c82a994a35a2; ExternalOrderNumber:WEB-202605-10122; IsOnlineOrder:true; Total:4730;",
  DateTime: ISODate("2026-05-30T14:21:00")
},
{
  _id: UUID("3cfbc1bd-2b05-4c4e-a5a1-a9810d00d74a"),
  LogID: UUID("3cfbc1bd-2b05-4c4e-a5a1-a9810d00d74a"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:af2fe39f-d160-41f6-a171-c67daddab7d8; ExternalOrderNumber:WEB-202605-10123; IsOnlineOrder:true; Total:3440;",
  DateTime: ISODate("2026-05-29T13:23:00")
},
{
  _id: UUID("b1998df3-1f9a-4403-8a5e-28322f88b793"),
  LogID: UUID("b1998df3-1f9a-4403-8a5e-28322f88b793"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:433b58bf-3360-4643-9a8b-7026f5b04b79; ExternalOrderNumber:WEB-202605-10124; IsOnlineOrder:true; Total:790;",
  DateTime: ISODate("2026-05-29T19:31:00")
},
{
  _id: UUID("bdaed78e-7fe6-49fc-9cae-689038108f6f"),
  LogID: UUID("bdaed78e-7fe6-49fc-9cae-689038108f6f"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:104107bf-40c4-4f64-addc-9bb9a774fc62; ExternalOrderNumber:WEB-202606-10125; IsOnlineOrder:true; Total:4780;",
  DateTime: ISODate("2026-06-03T10:16:00")
},
{
  _id: UUID("45822d0a-6d2b-4e61-a033-942b31b147f0"),
  LogID: UUID("45822d0a-6d2b-4e61-a033-942b31b147f0"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:76a099fe-b5f8-46a4-8c11-86f102928391; ExternalOrderNumber:WEB-202606-10126; IsOnlineOrder:true; Total:40510;",
  DateTime: ISODate("2026-06-01T09:18:00")
},
{
  _id: UUID("9206df0d-565e-4405-8165-a3426f52f931"),
  LogID: UUID("9206df0d-565e-4405-8165-a3426f52f931"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:b13568a0-b935-4e58-88bb-08b07d51a202; ExternalOrderNumber:SHOP-202606-10127; IsOnlineOrder:false; Total:8440;",
  DateTime: ISODate("2026-06-03T17:35:00")
},
{
  _id: UUID("dfb1fab5-2279-4693-bee1-c3162867d32d"),
  LogID: UUID("dfb1fab5-2279-4693-bee1-c3162867d32d"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:d58f5214-d2bc-426b-8c35-21c4ac4534ad; ExternalOrderNumber:SHOP-202606-10128; IsOnlineOrder:false; Total:2980;",
  DateTime: ISODate("2026-06-01T15:51:00")
},
{
  _id: UUID("fe4c1df2-cb02-4618-bd2a-5f59d9954f57"),
  LogID: UUID("fe4c1df2-cb02-4618-bd2a-5f59d9954f57"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:199f591c-b967-4647-8a0e-994bd27886ed; ExternalOrderNumber:SHOP-202606-10129; IsOnlineOrder:false; Total:4020;",
  DateTime: ISODate("2026-06-03T13:22:00")
},
{
  _id: UUID("13bf3ee6-b156-4e5b-a8e5-642582a1dff2"),
  LogID: UUID("13bf3ee6-b156-4e5b-a8e5-642582a1dff2"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:0e60a764-ac8c-48a3-a742-155e279d12d6; ExternalOrderNumber:WEB-202606-10130; IsOnlineOrder:true; Total:4970;",
  DateTime: ISODate("2026-06-01T15:22:00")
},
{
  _id: UUID("3374f74f-201c-4aaa-b183-ccd99ddcddbd"),
  LogID: UUID("3374f74f-201c-4aaa-b183-ccd99ddcddbd"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:01952a98-bb7e-4b51-84a4-62fc929ddaaa; ExternalOrderNumber:SHOP-202606-10131; IsOnlineOrder:false; Total:1170;",
  DateTime: ISODate("2026-06-01T09:08:00")
},
{
  _id: UUID("01c238f9-82d9-46f9-8e7a-ec2ffea29199"),
  LogID: UUID("01c238f9-82d9-46f9-8e7a-ec2ffea29199"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:515e192e-0699-4d8f-a071-3c8953501253; ExternalOrderNumber:WEB-202606-10132; IsOnlineOrder:true; Total:6570;",
  DateTime: ISODate("2026-06-05T14:28:00")
},
{
  _id: UUID("9e307855-636d-462c-843a-d4315a2bb42c"),
  LogID: UUID("9e307855-636d-462c-843a-d4315a2bb42c"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:f955243a-e8e4-4d7f-84af-b5e71c4f436e; ExternalOrderNumber:SHOP-202606-10133; IsOnlineOrder:false; Total:5490;",
  DateTime: ISODate("2026-06-04T14:46:00")
},
{
  _id: UUID("ecb59e87-944b-498d-b8ed-f3a791c791bd"),
  LogID: UUID("ecb59e87-944b-498d-b8ed-f3a791c791bd"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:168dd8b6-b40a-44d5-afe7-84d01ee02a8d; ExternalOrderNumber:WEB-202606-10134; IsOnlineOrder:true; Total:3950;",
  DateTime: ISODate("2026-06-02T17:21:00")
},
{
  _id: UUID("9fa69eef-6bd3-42ac-96a8-31f96b9622d4"),
  LogID: UUID("9fa69eef-6bd3-42ac-96a8-31f96b9622d4"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:aecc9c9d-b8d7-40da-aca5-714b3f53218c; ExternalOrderNumber:WEB-202606-10135; IsOnlineOrder:true; Total:5470;",
  DateTime: ISODate("2026-06-04T16:03:00")
},
{
  _id: UUID("c2fdab50-e79d-4813-9261-72738788d192"),
  LogID: UUID("c2fdab50-e79d-4813-9261-72738788d192"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:fe6e39a9-b719-4c4d-bd28-b54d13f70821; ExternalOrderNumber:WEB-202606-10136; IsOnlineOrder:true; Total:2390;",
  DateTime: ISODate("2026-06-05T11:28:00")
},
{
  _id: UUID("7ee2accf-00e2-455a-82bf-b3476cf6dd9a"),
  LogID: UUID("7ee2accf-00e2-455a-82bf-b3476cf6dd9a"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:836f5729-e2fe-4c17-8c1b-ab541ef24d86; ExternalOrderNumber:WEB-202606-10137; IsOnlineOrder:true; Total:7790;",
  DateTime: ISODate("2026-06-03T14:34:00")
},
{
  _id: UUID("0ff52087-8721-4b9f-9e19-f3feb3fa22fd"),
  LogID: UUID("0ff52087-8721-4b9f-9e19-f3feb3fa22fd"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:6db38d0f-d15e-4988-861b-9f2bdc559c3f; ExternalOrderNumber:WEB-202606-10138; IsOnlineOrder:true; Total:2490;",
  DateTime: ISODate("2026-06-06T14:21:00")
},
{
  _id: UUID("7ddf90fb-dbef-4148-a95d-efa3591ba6de"),
  LogID: UUID("7ddf90fb-dbef-4148-a95d-efa3591ba6de"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ЗАКАЗЫ",
  ActionType: "CREATE",
  LogDetails: "Order created; OrderID:e16a5181-ec1c-4f99-bf95-a1a4fe4d7340; ExternalOrderNumber:SHOP-202606-10139; IsOnlineOrder:false; Total:7860;",
  DateTime: ISODate("2026-06-04T09:23:00")
},
{
  _id: UUID("219e6c80-618b-4f4f-94a2-5d0b9bbb7f7c"),
  LogID: UUID("219e6c80-618b-4f4f-94a2-5d0b9bbb7f7c"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:f14a5cee-ee4b-4e89-9f4e-b610e5868ae2; Quantity:2;",
  DateTime: ISODate("2026-02-07T11:05:00")
},
{
  _id: UUID("78799e22-8c71-4a64-9bc1-d20e8973ffd4"),
  LogID: UUID("78799e22-8c71-4a64-9bc1-d20e8973ffd4"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:8d8ae379-33ac-4d52-bfe7-d359961c705b; Quantity:2;",
  DateTime: ISODate("2026-03-08T11:25:00")
},
{
  _id: UUID("edadf237-b556-40e9-acd4-34f15d9c4b0a"),
  LogID: UUID("edadf237-b556-40e9-acd4-34f15d9c4b0a"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:53f8516a-52bf-4405-a8a8-3e4287741999; Quantity:3;",
  DateTime: ISODate("2026-03-21T14:35:00")
},
{
  _id: UUID("d2cd92f6-3f99-47cb-8501-d24b857586c9"),
  LogID: UUID("d2cd92f6-3f99-47cb-8501-d24b857586c9"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:794e0bb6-5fdd-4af6-916e-45f55cb311f7; Quantity:1;",
  DateTime: ISODate("2026-04-08T16:05:00")
},
{
  _id: UUID("bbe799f8-611f-4a0f-b236-6c97ecda33e5"),
  LogID: UUID("bbe799f8-611f-4a0f-b236-6c97ecda33e5"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:09e6517b-76ef-47f7-9146-36f700f88130; Quantity:1;",
  DateTime: ISODate("2026-04-22T16:55:00")
},
{
  _id: UUID("be6372e1-8bdc-4416-97a3-3aebb674f700"),
  LogID: UUID("be6372e1-8bdc-4416-97a3-3aebb674f700"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:aabd99d2-a638-46a5-a16f-86ccf1cf82d9; Quantity:2;",
  DateTime: ISODate("2026-05-08T12:25:00")
},
{
  _id: UUID("e0e3896e-6b27-4af6-9d79-cd855aa4657d"),
  LogID: UUID("e0e3896e-6b27-4af6-9d79-cd855aa4657d"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:fe67ba7b-a2a9-43bc-9b6e-99bc7e5b4d16; Quantity:3;",
  DateTime: ISODate("2026-06-02T12:05:00")
},
{
  _id: UUID("47b716bc-f3ad-4428-8ff3-c6957ca948d3"),
  LogID: UUID("47b716bc-f3ad-4428-8ff3-c6957ca948d3"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "БРАК",
  ActionType: "CREATE",
  LogDetails: "Defective declared; ProductID:aabd99d2-a638-46a5-a16f-86ccf1cf82d9; Quantity:1;",
  DateTime: ISODate("2026-06-03T12:15:00")
},
{
  _id: UUID("6453ee28-6259-4898-a0cb-fc2df3e38d49"),
  LogID: UUID("6453ee28-6259-4898-a0cb-fc2df3e38d49"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "ОТЧЕТЫ",
  ActionType: "UPDATE",
  LogDetails: "Report generated for selected period;",
  DateTime: ISODate("2026-02-02T11:50:00")
},
{
  _id: UUID("5f22fe2e-a5c8-4c14-8a42-1c97b93d0b48"),
  LogID: UUID("5f22fe2e-a5c8-4c14-8a42-1c97b93d0b48"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "СКЛАДЫ",
  ActionType: "VIEW",
  LogDetails: "Warehouse balances reviewed;",
  DateTime: ISODate("2026-02-10T08:30:00")
},
{
  _id: UUID("85a08a27-dcb8-4db6-8cbf-7c3ae1546e25"),
  LogID: UUID("85a08a27-dcb8-4db6-8cbf-7c3ae1546e25"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "СКЛАДЫ",
  ActionType: "UPDATE",
  LogDetails: "User logged in;",
  DateTime: ISODate("2026-03-03T15:10:00")
},
{
  _id: UUID("0075e080-aeff-440b-b8cf-0b69d121135d"),
  LogID: UUID("0075e080-aeff-440b-b8cf-0b69d121135d"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ОТЧЕТЫ",
  ActionType: "UPDATE",
  LogDetails: "Report generated for selected period;",
  DateTime: ISODate("2026-03-09T14:00:00")
},
{
  _id: UUID("3455be59-e93b-4ae9-9acf-6de6fa833fbb"),
  LogID: UUID("3455be59-e93b-4ae9-9acf-6de6fa833fbb"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ТОВАРЫ",
  ActionType: "LOGIN",
  LogDetails: "User logged in;",
  DateTime: ISODate("2026-03-16T11:40:00")
},
{
  _id: UUID("429fbba3-8bd0-48e7-9296-73484596c2c1"),
  LogID: UUID("429fbba3-8bd0-48e7-9296-73484596c2c1"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "ТОВАРЫ",
  ActionType: "LOGIN",
  LogDetails: "User logged in;",
  DateTime: ISODate("2026-03-22T17:00:00")
},
{
  _id: UUID("9e392108-12c1-46dc-862c-8424b9ce9173"),
  LogID: UUID("9e392108-12c1-46dc-862c-8424b9ce9173"),
  StaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  LogCategory: "СКЛАДЫ",
  ActionType: "VIEW",
  LogDetails: "Warehouse balances reviewed;",
  DateTime: ISODate("2026-04-03T15:50:00")
},
{
  _id: UUID("41f1eef2-eb79-4646-aa7b-c2ddf0ce4d31"),
  LogID: UUID("41f1eef2-eb79-4646-aa7b-c2ddf0ce4d31"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "АВТОРИЗАЦИЯ",
  ActionType: "VIEW",
  LogDetails: "Report generated for selected period;",
  DateTime: ISODate("2026-04-06T16:30:00")
},
{
  _id: UUID("dd8f5627-6a74-4dba-9d0b-63676d343596"),
  LogID: UUID("dd8f5627-6a74-4dba-9d0b-63676d343596"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "СКЛАДЫ",
  ActionType: "VIEW",
  LogDetails: "Warehouse balances reviewed;",
  DateTime: ISODate("2026-05-03T17:10:00")
},
{
  _id: UUID("67f6da4c-558a-4107-bb61-7736eb7148fa"),
  LogID: UUID("67f6da4c-558a-4107-bb61-7736eb7148fa"),
  StaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  LogCategory: "СКЛАДЫ",
  ActionType: "VIEW",
  LogDetails: "Report generated for selected period;",
  DateTime: ISODate("2026-05-08T09:20:00")
},
{
  _id: UUID("2cf80342-cd9e-49c8-bc41-b809248483d2"),
  LogID: UUID("2cf80342-cd9e-49c8-bc41-b809248483d2"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "АВТОРИЗАЦИЯ",
  ActionType: "UPDATE",
  LogDetails: "Product card updated;",
  DateTime: ISODate("2026-05-13T13:45:00")
},
{
  _id: UUID("1c9a9e82-46e3-47d8-867d-5b754e2ceec4"),
  LogID: UUID("1c9a9e82-46e3-47d8-867d-5b754e2ceec4"),
  StaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  LogCategory: "ТОВАРЫ",
  ActionType: "UPDATE",
  LogDetails: "Product card updated;",
  DateTime: ISODate("2026-05-22T13:50:00")
},
{
  _id: UUID("5f82be71-9db8-4e26-bbca-1a0dcc8225f8"),
  LogID: UUID("5f82be71-9db8-4e26-bbca-1a0dcc8225f8"),
  StaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  LogCategory: "ТОВАРЫ",
  ActionType: "CREATE",
  LogDetails: "Warehouse balances reviewed;",
  DateTime: ISODate("2026-06-01T11:15:00")
},
{
  _id: UUID("57f3085a-acff-4184-a154-d276500dab17"),
  LogID: UUID("57f3085a-acff-4184-a154-d276500dab17"),
  StaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  LogCategory: "АВТОРИЗАЦИЯ",
  ActionType: "UPDATE",
  LogDetails: "User logged in;",
  DateTime: ISODate("2026-06-04T11:10:00")
}
];
database.getCollection("logs").insertMany(logs);

const messages = [
{
  _id: UUID("b1b48bc1-577f-4ca9-9a41-6ea069878a45"),
  InternalMessageID: UUID("b1b48bc1-577f-4ca9-9a41-6ea069878a45"),
  SenderStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  RecipientStaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  Subject: "Согласование закупки",
  Body: "Нужно согласовать дозаказ по товарам с высоким спросом.",
  SentAt: ISODate("2026-02-02T11:40:00"),
  IsRead: true
},
{
  _id: UUID("facce7f8-2ee0-4c15-9303-e713547e1061"),
  InternalMessageID: UUID("facce7f8-2ee0-4c15-9303-e713547e1061"),
  SenderStaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  RecipientStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  Subject: "Остатки по ходовой позиции",
  Body: "Проверьте фактический остаток в торговом зале и на резервном складе.",
  SentAt: ISODate("2026-02-10T12:40:00"),
  IsRead: true
},
{
  _id: UUID("399231ce-7988-48d7-9254-b8250399bcc3"),
  InternalMessageID: UUID("399231ce-7988-48d7-9254-b8250399bcc3"),
  SenderStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  RecipientStaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  Subject: "Согласование закупки",
  Body: "Нужно согласовать дозаказ по товарам с высоким спросом.",
  SentAt: ISODate("2026-02-15T14:00:00"),
  IsRead: true
},
{
  _id: UUID("8bb58fb2-ca86-4eda-ae84-acacb0be68e6"),
  InternalMessageID: UUID("8bb58fb2-ca86-4eda-ae84-acacb0be68e6"),
  SenderStaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  RecipientStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  Subject: "Проверка прихода товара",
  Body: "Проверьте приемку товара по последней накладной и склад назначения.",
  SentAt: ISODate("2026-02-24T17:15:00"),
  IsRead: true
},
{
  _id: UUID("969a9382-9245-4d76-8acd-cf9a3e0cfb1f"),
  InternalMessageID: UUID("969a9382-9245-4d76-8acd-cf9a3e0cfb1f"),
  SenderStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  RecipientStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  Subject: "Проверка прихода товара",
  Body: "Проверьте приемку товара по последней накладной и склад назначения.",
  SentAt: ISODate("2026-03-03T14:45:00"),
  IsRead: false
},
{
  _id: UUID("8ac065c0-ffa1-48c7-99f2-406c991f5e3f"),
  InternalMessageID: UUID("8ac065c0-ffa1-48c7-99f2-406c991f5e3f"),
  SenderStaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  RecipientStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  Subject: "Остатки по ходовой позиции",
  Body: "Проверьте фактический остаток в торговом зале и на резервном складе.",
  SentAt: ISODate("2026-03-10T13:15:00"),
  IsRead: true
},
{
  _id: UUID("8ed24d8a-482c-4ed4-9c73-f24d98aa42f3"),
  InternalMessageID: UUID("8ed24d8a-482c-4ed4-9c73-f24d98aa42f3"),
  SenderStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  RecipientStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  Subject: "Счет и накладная",
  Body: "Подготовьте печатные документы по заказу с внешним номером.",
  SentAt: ISODate("2026-03-16T17:15:00"),
  IsRead: false
},
{
  _id: UUID("09885b27-a507-42d3-928c-89aaa59e9808"),
  InternalMessageID: UUID("09885b27-a507-42d3-928c-89aaa59e9808"),
  SenderStaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  RecipientStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  Subject: "Перемещение товара",
  Body: "Перенесите часть товара из зоны приемки в торговый зал.",
  SentAt: ISODate("2026-03-19T17:50:00"),
  IsRead: false
},
{
  _id: UUID("9076799f-2a10-4966-89e0-3da148f3686b"),
  InternalMessageID: UUID("9076799f-2a10-4966-89e0-3da148f3686b"),
  SenderStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  RecipientStaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  Subject: "Проверка прихода товара",
  Body: "Проверьте приемку товара по последней накладной и склад назначения.",
  SentAt: ISODate("2026-03-29T16:40:00"),
  IsRead: true
},
{
  _id: UUID("927cb789-58b6-49ec-ba0f-dd5d5251ebe7"),
  InternalMessageID: UUID("927cb789-58b6-49ec-ba0f-dd5d5251ebe7"),
  SenderStaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  RecipientStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  Subject: "Проверка прихода товара",
  Body: "Проверьте приемку товара по последней накладной и склад назначения.",
  SentAt: ISODate("2026-04-02T15:10:00"),
  IsRead: true
},
{
  _id: UUID("4e669b19-9167-4d15-b54e-eee8ae740aaf"),
  InternalMessageID: UUID("4e669b19-9167-4d15-b54e-eee8ae740aaf"),
  SenderStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  RecipientStaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  Subject: "Перемещение товара",
  Body: "Перенесите часть товара из зоны приемки в торговый зал.",
  SentAt: ISODate("2026-04-09T11:15:00"),
  IsRead: true
},
{
  _id: UUID("e87a54aa-bb56-4207-b304-73f8d8228405"),
  InternalMessageID: UUID("e87a54aa-bb56-4207-b304-73f8d8228405"),
  SenderStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  RecipientStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  Subject: "Согласование закупки",
  Body: "Нужно согласовать дозаказ по товарам с высоким спросом.",
  SentAt: ISODate("2026-04-16T13:50:00"),
  IsRead: true
},
{
  _id: UUID("381dab9e-177f-4d0c-bbd9-c0bb5b061d3c"),
  InternalMessageID: UUID("381dab9e-177f-4d0c-bbd9-c0bb5b061d3c"),
  SenderStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  RecipientStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  Subject: "Уточнение адреса доставки",
  Body: "Перед отгрузкой онлайн-заказа нужно сверить адрес доставки клиента.",
  SentAt: ISODate("2026-04-27T16:45:00"),
  IsRead: false
},
{
  _id: UUID("d3ba7b89-2419-4393-ad36-63a3a795a66a"),
  InternalMessageID: UUID("d3ba7b89-2419-4393-ad36-63a3a795a66a"),
  SenderStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  RecipientStaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  Subject: "Перемещение товара",
  Body: "Перенесите часть товара из зоны приемки в торговый зал.",
  SentAt: ISODate("2026-05-02T13:30:00"),
  IsRead: false
},
{
  _id: UUID("e056afd3-108e-4692-bfc9-ec30b5cc254c"),
  InternalMessageID: UUID("e056afd3-108e-4692-bfc9-ec30b5cc254c"),
  SenderStaffID: UUID("ab81cda4-4ad8-4af4-ae99-c35ead928429"),
  RecipientStaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  Subject: "Уточнение адреса доставки",
  Body: "Перед отгрузкой онлайн-заказа нужно сверить адрес доставки клиента.",
  SentAt: ISODate("2026-05-11T11:40:00"),
  IsRead: true
},
{
  _id: UUID("c3f40047-7de5-48b7-bedf-822a977613f5"),
  InternalMessageID: UUID("c3f40047-7de5-48b7-bedf-822a977613f5"),
  SenderStaffID: UUID("e3f46570-7147-4e22-805a-2fb63d8f3074"),
  RecipientStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  Subject: "Проверка прихода товара",
  Body: "Проверьте приемку товара по последней накладной и склад назначения.",
  SentAt: ISODate("2026-05-17T11:40:00"),
  IsRead: true
},
{
  _id: UUID("a5452aac-263f-4828-a4a5-d6d804b5afbc"),
  InternalMessageID: UUID("a5452aac-263f-4828-a4a5-d6d804b5afbc"),
  SenderStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  RecipientStaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  Subject: "Проверка прихода товара",
  Body: "Проверьте приемку товара по последней накладной и склад назначения.",
  SentAt: ISODate("2026-05-22T10:30:00"),
  IsRead: false
},
{
  _id: UUID("c6749540-51d2-439d-ba47-53705413eb12"),
  InternalMessageID: UUID("c6749540-51d2-439d-ba47-53705413eb12"),
  SenderStaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  RecipientStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  Subject: "Согласование закупки",
  Body: "Нужно согласовать дозаказ по товарам с высоким спросом.",
  SentAt: ISODate("2026-05-28T15:30:00"),
  IsRead: false
},
{
  _id: UUID("429d51fd-15ca-4401-9572-61b386aa5020"),
  InternalMessageID: UUID("429d51fd-15ca-4401-9572-61b386aa5020"),
  SenderStaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  RecipientStaffID: UUID("0a99e235-eb48-4c4b-bef2-5e1d10cd422d"),
  Subject: "Уточнение адреса доставки",
  Body: "Перед отгрузкой онлайн-заказа нужно сверить адрес доставки клиента.",
  SentAt: ISODate("2026-06-01T10:15:00"),
  IsRead: false
},
{
  _id: UUID("cc7cf5fe-39db-4762-aae5-16c57bac68dd"),
  InternalMessageID: UUID("cc7cf5fe-39db-4762-aae5-16c57bac68dd"),
  SenderStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  RecipientStaffID: UUID("13a222a7-f108-41ba-b90b-e45cca1e029f"),
  Subject: "Остатки по ходовой позиции",
  Body: "Проверьте фактический остаток в торговом зале и на резервном складе.",
  SentAt: ISODate("2026-06-01T16:15:00"),
  IsRead: true
},
{
  _id: UUID("ac484c95-52ae-41a2-843b-84fe85f78ce7"),
  InternalMessageID: UUID("ac484c95-52ae-41a2-843b-84fe85f78ce7"),
  SenderStaffID: UUID("14da5b34-2e50-4eff-9d47-3ec4c9bcb194"),
  RecipientStaffID: UUID("3f84369b-1142-484f-8cb4-6b152715f4fa"),
  Subject: "Согласование закупки",
  Body: "Нужно согласовать дозаказ по товарам с высоким спросом.",
  SentAt: ISODate("2026-06-04T15:00:00"),
  IsRead: true
}
];
database.getCollection("messages").insertMany(messages);

database.getCollection("purchase-receipts").createIndex({ SupplierID: 1 });
database.getCollection("purchase-receipts").createIndex({ ProductID: 1 });
database.getCollection("purchase-receipts").createIndex({ WarehouseID: 1 });
database.getCollection("purchase-receipts").createIndex({ PurchasedAt: -1 });
database.getCollection("orders").createIndex({ ExternalOrderNumber: 1 });
database.getCollection("orders").createIndex({ IsOnlineOrder: 1 });
database.getCollection("orders").createIndex({ OrderDate: -1 });
database.getCollection("orders").createIndex({ CustomerID: 1 });
database.getCollection("order-details").createIndex({ OrderID: 1 });
database.getCollection("order-details").createIndex({ ProductID: 1 });
database.getCollection("messages").createIndex({ RecipientStaffID: 1, SentAt: -1 });
database.getCollection("messages").createIndex({ SenderStaffID: 1, SentAt: -1 });
database.getCollection("logs").createIndex({ DateTime: -1 });
database.getCollection("product-locations").createIndex({ LocationID: 1, ProductID: 1 });

print("Готово: база StockKeeperMailDb заполнена данными до 06.06.2026.");
print("Период: 01.02.2026 — 06.06.2026");
print("Заказы по месяцам: февраль 18, март 37, апрель 24, май 46, июнь 15");
print("Всего заказов: " + orders.length);
print("Строк заказов: " + orderDetails.length);
print("Приходов товара: " + purchaseReceipts.length);
print("Товаров: " + products.length);
print("Складов/магазинов: " + warehouses.length);
print("Локаций: " + locations.length);
print("Клиентов: " + customers.length);
print("Сообщений: " + messages.length);
print("Журнал событий: " + logs.length);
