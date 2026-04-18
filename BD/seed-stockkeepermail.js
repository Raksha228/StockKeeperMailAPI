// Seed для StockKeeperMail / MongoDB / mongosh
// База: StockKeeperMailDb
// ВАЖНО: для сущностей с [BsonId] поле GUID хранится в MongoDB как _id.
// Запуск:
//   mongosh "mongodb://localhost:27017/StockKeeperMailDb" seed-stockkeepermail.js
//
// Скрипт:
// - очищает основные коллекции проекта
// - заполняет роли, сотрудников, категории, поставщиков, склады, локации
// - добавляет товары, остатки по локациям, покупателей, заказы, строки заказов, брак и журналы
//
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
  "customers",
  "orders",
  "order-details",
  "defectives",
  "logs",
  "messages"
];

collectionsToReset.forEach(name => database.getCollection(name).deleteMany({}));

const roles = [
{
  _id: UUID("f59e8d9d-e9ea-5351-8f5f-ce0dfa519065"),
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
  _id: UUID("840facc0-3e2b-50f9-a911-bd6432c57085"),
  RoleName: "Администратор",
  RoleStatus: "Active",
  RoleDescription: "Управление продажами, товарами, поставщиками и персоналом без полного системного доступа",
  OrdersView: true,
  OrdersAdd: true,
  OrdersEdit: true,
  OrdersDelete: false,
  CustomersView: true,
  CustomersAdd: true,
  CustomersEdit: true,
  CustomersDelete: false,
  ProductsView: true,
  ProductsAdd: true,
  ProductsEdit: true,
  ProductsDelete: false,
  StoragesView: true,
  StoragesAdd: true,
  StoragesEdit: true,
  StoragesDelete: false,
  DefectivesView: true,
  DefectivesAdd: true,
  DefectivesEdit: true,
  DefectivesDelete: false,
  CategoriesView: true,
  CategoriesAdd: true,
  CategoriesEdit: true,
  CategoriesDelete: false,
  LocationsView: true,
  LocationsAdd: true,
  LocationsEdit: true,
  LocationsDelete: false,
  SuppliersView: true,
  SuppliersAdd: true,
  SuppliersEdit: true,
  SuppliersDelete: false,
  RolesView: true,
  RolesAdd: false,
  RolesEdit: false,
  RolesDelete: false,
  StaffsView: true,
  StaffsAdd: true,
  StaffsEdit: true,
  StaffsDelete: false,
  LogsView: true,
  LogsAdd: false,
  LogsEdit: false,
  LogsDelete: false
},
{
  _id: UUID("5aa02ddb-1499-5ebf-b56e-50ef9162a4cf"),
  RoleName: "Продавец",
  RoleStatus: "Active",
  RoleDescription: "Оформление заказов, работа с клиентами и просмотр складских остатков",
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
}
];
database.getCollection("roles").insertMany(roles);

const staff = [
{
  _id: UUID("4be43b93-b4cb-5c93-b1b6-434251fd7e7d"),
  RoleID: UUID("f59e8d9d-e9ea-5351-8f5f-ce0dfa519065"),
  StaffFirstName: "Алексей",
  StaffLastName: "Кузнецов",
  StaffAddress: "Ростовская обл., г. Волгодонск, б-р Великой Победы, 11, офис 10",
  StaffPhone: "+7-928-600-11-01",
  StaffEmail: "admin@ortouro.local",
  StaffUsername: "admin",
  StaffPassword: "admin123"
},
{
  _id: UUID("38841fb3-3d9e-530e-87ac-405843ba1e82"),
  RoleID: UUID("840facc0-3e2b-50f9-a911-bd6432c57085"),
  StaffFirstName: "Марина",
  StaffLastName: "Егорова",
  StaffAddress: "Ростовская обл., г. Волгодонск, б-р Великой Победы, 11, офис 10",
  StaffPhone: "+7-928-600-11-02",
  StaffEmail: "administrator@ortouro.local",
  StaffUsername: "administrator",
  StaffPassword: "admin456"
},
{
  _id: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  RoleID: UUID("5aa02ddb-1499-5ebf-b56e-50ef9162a4cf"),
  StaffFirstName: "Ирина",
  StaffLastName: "Соколова",
  StaffAddress: "Ростовская обл., г. Волгодонск, ул. Энтузиастов, 18",
  StaffPhone: "+7-928-600-11-03",
  StaffEmail: "seller1@ortouro.local",
  StaffUsername: "seller1",
  StaffPassword: "seller123"
},
{
  _id: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  RoleID: UUID("5aa02ddb-1499-5ebf-b56e-50ef9162a4cf"),
  StaffFirstName: "Павел",
  StaffLastName: "Логинов",
  StaffAddress: "Ростовская обл., г. Волгодонск, ул. Морская, 34",
  StaffPhone: "+7-928-600-11-04",
  StaffEmail: "seller2@ortouro.local",
  StaffUsername: "seller2",
  StaffPassword: "seller123"
},
{
  _id: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  RoleID: UUID("5aa02ddb-1499-5ebf-b56e-50ef9162a4cf"),
  StaffFirstName: "Елена",
  StaffLastName: "Громова",
  StaffAddress: "Ростовская обл., г. Волгодонск, ул. Ленина, 82",
  StaffPhone: "+7-928-600-11-05",
  StaffEmail: "seller3@ortouro.local",
  StaffUsername: "seller3",
  StaffPassword: "seller123"
}
];
database.getCollection("staff").insertMany(staff);

const categories = [
{
  _id: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  CategoryName: "Орто",
  CategoryStatus: "Active",
  CategoryDescription: "Ортопедические изделия, компрессионный трикотаж, средства реабилитации, инвалидные коляски и туторы"
},
{
  _id: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  CategoryName: "Уро",
  CategoryStatus: "Active",
  CategoryDescription: "Урологические изделия: катетеры для самокатетеризации, мочеприемники и урологические наборы"
}
];
database.getCollection("categories").insertMany(categories);

const suppliers = [
{
  _id: UUID("ddde6b86-cb9d-59cb-91a8-50f74303af87"),
  SupplierName: "ООО «КРЕЙТ»",
  SupplierAddress: "195220, г. Санкт-Петербург, ул. Бутлерова, д. 11, к. 4",
  SupplierPhone: "+7 (800) 700-68-50",
  SupplierEmail: "kreit@kreitspb.ru",
  SupplierStatus: "Active"
},
{
  _id: UUID("b1114d18-d8cc-5ca6-8baa-389457a3b244"),
  SupplierName: "ООО «Тривес»",
  SupplierAddress: "196624, Россия, г. Санкт-Петербург",
  SupplierPhone: "+7 (812) 329-72-97",
  SupplierEmail: "sale@trives-spb.ru",
  SupplierStatus: "Active"
},
{
  _id: UUID("18c86884-7b4a-58be-b987-b4c15eedfb5f"),
  SupplierName: "ООО «ЭКОТЕН»",
  SupplierAddress: "197110, г. Санкт-Петербург, Константиновский пр., д. 18А, пом. 11Н",
  SupplierPhone: "+7 (812) 325-09-04",
  SupplierEmail: "e-mail@ecoten.ru",
  SupplierStatus: "Active"
},
{
  _id: UUID("44ffbaad-8af0-5f8b-b7b6-c4177e292cda"),
  SupplierName: "ООО «Малтри»",
  SupplierAddress: "190020, г. Санкт-Петербург",
  SupplierPhone: "+7 (812) 336-39-99",
  SupplierEmail: "info@maltri.ru",
  SupplierStatus: "Active"
},
{
  _id: UUID("2b60a221-2ddc-5445-a501-5189e4d2c20f"),
  SupplierName: "ТД «ОптоМед»",
  SupplierAddress: "г. Москва, ул. Кантемировская, д. 58",
  SupplierPhone: "+7 (495) 979-17-75",
  SupplierEmail: "info@ortopt.ru",
  SupplierStatus: "Active"
},
{
  _id: UUID("889fe7ad-9860-531c-9d38-d0f203f8d65a"),
  SupplierName: "ООО «Интернет Решения» (Ozon)",
  SupplierAddress: "123112, г. Москва, Пресненская наб., д. 10",
  SupplierPhone: "",
  SupplierEmail: "",
  SupplierStatus: "Active"
},
{
  _id: UUID("4b9c4f43-d5f3-5a18-b446-0da7aa56798e"),
  SupplierName: "ООО «РВБ» (Wildberries)",
  SupplierAddress: "Россия, онлайн-площадка",
  SupplierPhone: "",
  SupplierEmail: "",
  SupplierStatus: "Active"
},
{
  _id: UUID("1d578c20-acc5-5dcb-beb3-5035767303b9"),
  SupplierName: "ООО «Аванта Медика»",
  SupplierAddress: "119331, г. Москва, пр-кт Вернадского, д. 29",
  SupplierPhone: "+7 (499) 130-30-57",
  SupplierEmail: "info@avantamedika.ru",
  SupplierStatus: "Active"
},
{
  _id: UUID("f3b159d2-6c3d-51ee-9caa-62f81b47b631"),
  SupplierName: "Mystoma.ru",
  SupplierAddress: "г. Москва",
  SupplierPhone: "+7 (495) 509-44-49",
  SupplierEmail: "mystoma@gmail.com",
  SupplierStatus: "Active"
},
{
  _id: UUID("1f1a9e0f-4fc5-582c-a9f6-bdab1e0fb5dc"),
  SupplierName: "ООО «Лик-Мед» (МеДеРи)",
  SupplierAddress: "г. Санкт-Петербург, ул. Константина Заслонова, д. 11",
  SupplierPhone: "+7 (812) 600-19-93",
  SupplierEmail: "likmed-sales@bk.ru",
  SupplierStatus: "Active"
}
];
database.getCollection("suppliers").insertMany(suppliers);

const warehouses = [
{
  _id: UUID("84900bc7-be71-5036-87ca-245626fb8e3c"),
  WarehouseName: "Магазин «ОртоУро» — Основной",
  WarehouseAddress: "Ростовская обл., г. Волгодонск, б-р Великой Победы, 11, офис 10",
  WarehousePhone: "+7-8639-90-11-10",
  WarehouseEmail: "shop1@ortouro.local",
  WarehouseVat: NumberDecimal("20.00")
},
{
  _id: UUID("0935fa03-15a5-50ce-885e-f6833571d7ed"),
  WarehouseName: "Магазин «ОртоУро» — Восточный",
  WarehouseAddress: "Ростовская обл., г. Волгодонск, ул. Энтузиастов, 28",
  WarehousePhone: "+7-8639-90-11-11",
  WarehouseEmail: "shop2@ortouro.local",
  WarehouseVat: NumberDecimal("20.00")
},
{
  _id: UUID("36083aa4-a7a7-5850-b983-12ca08baa150"),
  WarehouseName: "Склад «ОртоУро» — Центральный",
  WarehouseAddress: "Ростовская обл., г. Волгодонск, ул. 8-я Заводская, 12",
  WarehousePhone: "+7-8639-90-11-12",
  WarehouseEmail: "warehouse@ortouro.local",
  WarehouseVat: NumberDecimal("20.00")
}
];
database.getCollection("warehouses").insertMany(warehouses);

const locations = [
{
  _id: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  LocationName: "Основной магазин — витрина 1"
},
{
  _id: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  LocationName: "Основной магазин — витрина 2"
},
{
  _id: UUID("290c4f1f-5b00-5701-8ff1-407bfc08c780"),
  LocationName: "Основной магазин — стеллаж A1"
},
{
  _id: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  LocationName: "Основной магазин — стеллаж A2"
},
{
  _id: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  LocationName: "Основной магазин — подсобка"
},
{
  _id: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  LocationName: "Восточный магазин — витрина 1"
},
{
  _id: UUID("4863ca60-8dbe-597f-9482-b44df88d7930"),
  LocationName: "Восточный магазин — витрина 2"
},
{
  _id: UUID("560de5b9-d5fd-5f38-8189-d70fe93f9181"),
  LocationName: "Восточный магазин — стеллаж B1"
},
{
  _id: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  LocationName: "Центральный склад — ячейка A1"
},
{
  _id: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  LocationName: "Центральный склад — ячейка A2"
},
{
  _id: UUID("ce678276-912f-525b-8218-59627be7d149"),
  LocationName: "Центральный склад — ячейка B1"
},
{
  _id: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  LocationName: "Центральный склад — приемка"
}
];
database.getCollection("locations").insertMany(locations);

const products = [
{
  _id: UUID("7f840b26-94e7-587e-9774-1f6e376bdfb2"),
  SupplierID: UUID("ddde6b86-cb9d-59cb-91a8-50f74303af87"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж на брюшную стенку",
  ProductSKU: "ORTO-001",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1290.00"),
  ProductQuantity: 24,
  ProductAvailability: "Available"
},
{
  _id: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  SupplierID: UUID("ddde6b86-cb9d-59cb-91a8-50f74303af87"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж послеродовой",
  ProductSKU: "ORTO-002",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1490.00"),
  ProductQuantity: 18,
  ProductAvailability: "Available"
},
{
  _id: UUID("2e7ca414-836f-5174-8c7c-4455fb580cd4"),
  SupplierID: UUID("b1114d18-d8cc-5ca6-8baa-389457a3b244"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж послеоперационный на грудную клетку женский",
  ProductSKU: "ORTO-003",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("2390.00"),
  ProductQuantity: 9,
  ProductAvailability: "Available"
},
{
  _id: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  SupplierID: UUID("b1114d18-d8cc-5ca6-8baa-389457a3b244"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж дородовой",
  ProductSKU: "ORTO-004",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1790.00"),
  ProductQuantity: 14,
  ProductAvailability: "Available"
},
{
  _id: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  SupplierID: UUID("18c86884-7b4a-58be-b987-b4c15eedfb5f"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Корсет ортопедический",
  ProductSKU: "ORTO-005",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("3190.00"),
  ProductQuantity: 11,
  ProductAvailability: "Available"
},
{
  _id: UUID("982ce262-b2ce-5167-b85e-1d84783d4ebc"),
  SupplierID: UUID("18c86884-7b4a-58be-b987-b4c15eedfb5f"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж послеоперационный на брюшную стенку",
  ProductSKU: "ORTO-006",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1990.00"),
  ProductQuantity: 16,
  ProductAvailability: "Available"
},
{
  _id: UUID("550a6126-9886-5858-b6f6-58deebd3a657"),
  SupplierID: UUID("44ffbaad-8af0-5f8b-b7b6-c4177e292cda"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Корсет ортопедический поясничный усиленный",
  ProductSKU: "ORTO-007",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("4890.00"),
  ProductQuantity: 8,
  ProductAvailability: "Available"
},
{
  _id: UUID("c2d3ccfe-6b55-519a-86e4-12b0d73f39f8"),
  SupplierID: UUID("44ffbaad-8af0-5f8b-b7b6-c4177e292cda"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж фиксирующий для руки",
  ProductSKU: "ORTO-008",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1190.00"),
  ProductQuantity: 21,
  ProductAvailability: "Available"
},
{
  _id: UUID("2a4f1de8-b2eb-555e-a7d4-6e8c6fbd1d70"),
  SupplierID: UUID("2b60a221-2ddc-5445-a501-5189e4d2c20f"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж для руки",
  ProductSKU: "ORTO-009",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("990.00"),
  ProductQuantity: 25,
  ProductAvailability: "Available"
},
{
  _id: UUID("d2a0bcd3-2cac-5be6-a87d-db963ffa37c5"),
  SupplierID: UUID("2b60a221-2ddc-5445-a501-5189e4d2c20f"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж компрессионный на лучезапястный сустав",
  ProductSKU: "ORTO-010",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("890.00"),
  ProductQuantity: 13,
  ProductAvailability: "Available"
},
{
  _id: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  SupplierID: UUID("2b60a221-2ddc-5445-a501-5189e4d2c20f"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж на лучезапястный сустав",
  ProductSKU: "ORTO-011",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("790.00"),
  ProductQuantity: 20,
  ProductAvailability: "Available"
},
{
  _id: UUID("bb6b7911-678d-52c8-82a7-c5720b42c33b"),
  SupplierID: UUID("ddde6b86-cb9d-59cb-91a8-50f74303af87"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж на бедро",
  ProductSKU: "ORTO-012",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1290.00"),
  ProductQuantity: 7,
  ProductAvailability: "Available"
},
{
  _id: UUID("32515653-1be6-534a-9670-2a4333191e00"),
  SupplierID: UUID("b1114d18-d8cc-5ca6-8baa-389457a3b244"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж на голень и голеностопный сустав",
  ProductSKU: "ORTO-013",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1590.00"),
  ProductQuantity: 15,
  ProductAvailability: "Available"
},
{
  _id: UUID("d64b3134-3e6b-5699-aa1c-26cdb6281567"),
  SupplierID: UUID("18c86884-7b4a-58be-b987-b4c15eedfb5f"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Бандаж шейный детский",
  ProductSKU: "ORTO-014",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("1090.00"),
  ProductQuantity: 12,
  ProductAvailability: "Available"
},
{
  _id: UUID("af8561cb-fd5f-5c69-84a8-d4fc7608ca2b"),
  SupplierID: UUID("44ffbaad-8af0-5f8b-b7b6-c4177e292cda"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Гольфы компрессионные мужские",
  ProductSKU: "ORTO-015",
  ProductUnit: "пара",
  ProductPrice: NumberDecimal("1690.00"),
  ProductQuantity: 26,
  ProductAvailability: "Available"
},
{
  _id: UUID("7989d799-effa-5214-9205-b48e3d4ce254"),
  SupplierID: UUID("44ffbaad-8af0-5f8b-b7b6-c4177e292cda"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Гольфы компрессионные женские",
  ProductSKU: "ORTO-016",
  ProductUnit: "пара",
  ProductPrice: NumberDecimal("1690.00"),
  ProductQuantity: 22,
  ProductAvailability: "Available"
},
{
  _id: UUID("49837b1c-aeac-5661-8d07-a97adc41d851"),
  SupplierID: UUID("2b60a221-2ddc-5445-a501-5189e4d2c20f"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Компрессионный трикотаж эластичный",
  ProductSKU: "ORTO-017",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("2190.00"),
  ProductQuantity: 10,
  ProductAvailability: "Available"
},
{
  _id: UUID("241ce5fb-54ae-554f-b6f7-6edfa6a4290e"),
  SupplierID: UUID("889fe7ad-9860-531c-9d38-d0f203f8d65a"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Инвалидная коляска складная",
  ProductSKU: "ORTO-018",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("28900.00"),
  ProductQuantity: 3,
  ProductAvailability: "Unavailable"
},
{
  _id: UUID("f29e8709-5006-5eb5-b95a-bb656d0db629"),
  SupplierID: UUID("4b9c4f43-d5f3-5a18-b446-0da7aa56798e"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Инвалидная коляска комнатная",
  ProductSKU: "ORTO-019",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("31200.00"),
  ProductQuantity: 1,
  ProductAvailability: "Unavailable"
},
{
  _id: UUID("888a2181-f7c0-5886-8f08-fea73f0c0b12"),
  SupplierID: UUID("b1114d18-d8cc-5ca6-8baa-389457a3b244"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Тутор на коленный сустав",
  ProductSKU: "ORTO-020",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("3490.00"),
  ProductQuantity: 6,
  ProductAvailability: "Available"
},
{
  _id: UUID("1296c8f3-4c34-58bd-8fa5-58e65c09dc6b"),
  SupplierID: UUID("ddde6b86-cb9d-59cb-91a8-50f74303af87"),
  CategoryID: UUID("ffe9e06e-ec2e-5dc2-856b-ccc6b53f3334"),
  ProductName: "Тутор на голеностопный сустав",
  ProductSKU: "ORTO-021",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("2990.00"),
  ProductQuantity: 0,
  ProductAvailability: "Out Of Stock"
},
{
  _id: UUID("069fefd7-707c-59e7-a809-b4e2bcda0482"),
  SupplierID: UUID("1d578c20-acc5-5dcb-beb3-5035767303b9"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Набор-мочеприемник Нелатон Coloplast",
  ProductSKU: "URO-001",
  ProductUnit: "уп.",
  ProductPrice: NumberDecimal("780.00"),
  ProductQuantity: 30,
  ProductAvailability: "Available"
},
{
  _id: UUID("4ddeb0e5-975c-5777-82c6-602057f15e41"),
  SupplierID: UUID("f3b159d2-6c3d-51ee-9caa-62f81b47b631"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Набор-мочеприемник Нелатон B. Braun",
  ProductSKU: "URO-002",
  ProductUnit: "уп.",
  ProductPrice: NumberDecimal("760.00"),
  ProductQuantity: 28,
  ProductAvailability: "Available"
},
{
  _id: UUID("fc9744f3-b31a-51a4-a760-d3d049d8f8f1"),
  SupplierID: UUID("1f1a9e0f-4fc5-582c-a9f6-bdab1e0fb5dc"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Набор-мочеприемник Нелатон Integral",
  ProductSKU: "URO-003",
  ProductUnit: "уп.",
  ProductPrice: NumberDecimal("690.00"),
  ProductQuantity: 18,
  ProductAvailability: "Available"
},
{
  _id: UUID("6f81d746-9038-5d87-b0ab-1c40cac51de0"),
  SupplierID: UUID("1d578c20-acc5-5dcb-beb3-5035767303b9"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер лубрицированный Coloplast",
  ProductSKU: "URO-004",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("390.00"),
  ProductQuantity: 45,
  ProductAvailability: "Available"
},
{
  _id: UUID("26ac85a1-197a-5273-80d6-c7a0f829b34d"),
  SupplierID: UUID("1d578c20-acc5-5dcb-beb3-5035767303b9"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер лубрицированный Coloplast EasiCath",
  ProductSKU: "URO-005",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("430.00"),
  ProductQuantity: 52,
  ProductAvailability: "Available"
},
{
  _id: UUID("97e97f84-88e5-5221-a6f1-434d1566bbcb"),
  SupplierID: UUID("f3b159d2-6c3d-51ee-9caa-62f81b47b631"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер лубрицированный B. Braun Actreen Lite",
  ProductSKU: "URO-006",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("410.00"),
  ProductQuantity: 38,
  ProductAvailability: "Available"
},
{
  _id: UUID("3377495b-f6e6-5b19-aacd-dd4ddce972b4"),
  SupplierID: UUID("1f1a9e0f-4fc5-582c-a9f6-bdab1e0fb5dc"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер лубрицированный Mederen",
  ProductSKU: "URO-007",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("350.00"),
  ProductQuantity: 33,
  ProductAvailability: "Available"
},
{
  _id: UUID("65b879b6-a61c-5043-af71-62a7958a4713"),
  SupplierID: UUID("1f1a9e0f-4fc5-582c-a9f6-bdab1e0fb5dc"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер лубрицированный Apexmed",
  ProductSKU: "URO-008",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("320.00"),
  ProductQuantity: 40,
  ProductAvailability: "Available"
},
{
  _id: UUID("a7f088ef-23fc-557f-b470-818b2c999819"),
  SupplierID: UUID("1d578c20-acc5-5dcb-beb3-5035767303b9"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Набор-мочеприемник Coloplast EasiCath Set",
  ProductSKU: "URO-009",
  ProductUnit: "уп.",
  ProductPrice: NumberDecimal("890.00"),
  ProductQuantity: 17,
  ProductAvailability: "Available"
},
{
  _id: UUID("d37e1ce4-6ae2-5d76-85ad-67959bcf03a1"),
  SupplierID: UUID("f3b159d2-6c3d-51ee-9caa-62f81b47b631"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Набор-мочеприемник B. Braun Actreen Glys Set",
  ProductSKU: "URO-010",
  ProductUnit: "уп.",
  ProductPrice: NumberDecimal("870.00"),
  ProductQuantity: 4,
  ProductAvailability: "Unavailable"
},
{
  _id: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  SupplierID: UUID("1d578c20-acc5-5dcb-beb3-5035767303b9"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Мочеприемник ножной Coloplast Conveen Security+",
  ProductSKU: "URO-011",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("590.00"),
  ProductQuantity: 24,
  ProductAvailability: "Available"
},
{
  _id: UUID("701b3743-5c98-5e45-8a81-ee8bf769ea15"),
  SupplierID: UUID("1d578c20-acc5-5dcb-beb3-5035767303b9"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Мочеприемник прикроватный Coloplast Conveen Standard 1500 мл",
  ProductSKU: "URO-012",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("640.00"),
  ProductQuantity: 19,
  ProductAvailability: "Available"
},
{
  _id: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  SupplierID: UUID("1f1a9e0f-4fc5-582c-a9f6-bdab1e0fb5dc"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Мочеприемник прикроватный Coloplast Conveen Basic 2000 мл",
  ProductSKU: "URO-013",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("680.00"),
  ProductQuantity: 21,
  ProductAvailability: "Available"
},
{
  _id: UUID("53af2937-b05b-5753-a125-cf664bb7ba8b"),
  SupplierID: UUID("f3b159d2-6c3d-51ee-9caa-62f81b47b631"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер Нелатона Coloplast",
  ProductSKU: "URO-014",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("270.00"),
  ProductQuantity: 36,
  ProductAvailability: "Available"
},
{
  _id: UUID("eacd521b-981a-5879-9c4e-4bc19faa7d6e"),
  SupplierID: UUID("f3b159d2-6c3d-51ee-9caa-62f81b47b631"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер Нелатона B. Braun",
  ProductSKU: "URO-015",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("260.00"),
  ProductQuantity: 31,
  ProductAvailability: "Available"
},
{
  _id: UUID("3611640a-7c2c-5211-93bd-93e7ee9b55fc"),
  SupplierID: UUID("1f1a9e0f-4fc5-582c-a9f6-bdab1e0fb5dc"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер Нелатона Integral",
  ProductSKU: "URO-016",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("240.00"),
  ProductQuantity: 20,
  ProductAvailability: "Available"
},
{
  _id: UUID("d0daaeb5-7169-5bf2-adfb-9ef7149a0fd7"),
  SupplierID: UUID("1f1a9e0f-4fc5-582c-a9f6-bdab1e0fb5dc"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Катетер Нелатона Apexmed",
  ProductSKU: "URO-017",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("230.00"),
  ProductQuantity: 18,
  ProductAvailability: "Available"
},
{
  _id: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  SupplierID: UUID("f3b159d2-6c3d-51ee-9caa-62f81b47b631"),
  CategoryID: UUID("9c2e7ea7-3c90-5ad0-9a29-ac7f09bc1819"),
  ProductName: "Мочеприемник ножной B. Braun",
  ProductSKU: "URO-018",
  ProductUnit: "шт.",
  ProductPrice: NumberDecimal("560.00"),
  ProductQuantity: 16,
  ProductAvailability: "Available"
}
];
database.getCollection("products").insertMany(products);

const product_locations = [
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("7f840b26-94e7-587e-9774-1f6e376bdfb2"),
  ProductQuantity: 8
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("7f840b26-94e7-587e-9774-1f6e376bdfb2"),
  ProductQuantity: 6
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("7f840b26-94e7-587e-9774-1f6e376bdfb2"),
  ProductQuantity: 10
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  ProductQuantity: 6
},
{
  LocationID: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  ProductQuantity: 4
},
{
  LocationID: UUID("290c4f1f-5b00-5701-8ff1-407bfc08c780"),
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  ProductQuantity: 8
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("2e7ca414-836f-5174-8c7c-4455fb580cd4"),
  ProductQuantity: 6
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("2e7ca414-836f-5174-8c7c-4455fb580cd4"),
  ProductQuantity: 3
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  ProductQuantity: 4
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  ProductQuantity: 3
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  ProductQuantity: 7
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  ProductQuantity: 3
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  ProductQuantity: 2
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  ProductQuantity: 6
},
{
  LocationID: UUID("290c4f1f-5b00-5701-8ff1-407bfc08c780"),
  ProductID: UUID("982ce262-b2ce-5167-b85e-1d84783d4ebc"),
  ProductQuantity: 5
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("982ce262-b2ce-5167-b85e-1d84783d4ebc"),
  ProductQuantity: 4
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("982ce262-b2ce-5167-b85e-1d84783d4ebc"),
  ProductQuantity: 7
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("550a6126-9886-5858-b6f6-58deebd3a657"),
  ProductQuantity: 5
},
{
  LocationID: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  ProductID: UUID("550a6126-9886-5858-b6f6-58deebd3a657"),
  ProductQuantity: 3
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("c2d3ccfe-6b55-519a-86e4-12b0d73f39f8"),
  ProductQuantity: 7
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("c2d3ccfe-6b55-519a-86e4-12b0d73f39f8"),
  ProductQuantity: 5
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("c2d3ccfe-6b55-519a-86e4-12b0d73f39f8"),
  ProductQuantity: 9
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("2a4f1de8-b2eb-555e-a7d4-6e8c6fbd1d70"),
  ProductQuantity: 8
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("2a4f1de8-b2eb-555e-a7d4-6e8c6fbd1d70"),
  ProductQuantity: 6
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("2a4f1de8-b2eb-555e-a7d4-6e8c6fbd1d70"),
  ProductQuantity: 11
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("d2a0bcd3-2cac-5be6-a87d-db963ffa37c5"),
  ProductQuantity: 4
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("d2a0bcd3-2cac-5be6-a87d-db963ffa37c5"),
  ProductQuantity: 3
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("d2a0bcd3-2cac-5be6-a87d-db963ffa37c5"),
  ProductQuantity: 6
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  ProductQuantity: 7
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  ProductQuantity: 5
},
{
  LocationID: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  ProductID: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  ProductQuantity: 8
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("bb6b7911-678d-52c8-82a7-c5720b42c33b"),
  ProductQuantity: 5
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("bb6b7911-678d-52c8-82a7-c5720b42c33b"),
  ProductQuantity: 2
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("32515653-1be6-534a-9670-2a4333191e00"),
  ProductQuantity: 5
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("32515653-1be6-534a-9670-2a4333191e00"),
  ProductQuantity: 3
},
{
  LocationID: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  ProductID: UUID("32515653-1be6-534a-9670-2a4333191e00"),
  ProductQuantity: 7
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("d64b3134-3e6b-5699-aa1c-26cdb6281567"),
  ProductQuantity: 4
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("d64b3134-3e6b-5699-aa1c-26cdb6281567"),
  ProductQuantity: 3
},
{
  LocationID: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  ProductID: UUID("d64b3134-3e6b-5699-aa1c-26cdb6281567"),
  ProductQuantity: 5
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("af8561cb-fd5f-5c69-84a8-d4fc7608ca2b"),
  ProductQuantity: 9
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("af8561cb-fd5f-5c69-84a8-d4fc7608ca2b"),
  ProductQuantity: 6
},
{
  LocationID: UUID("ce678276-912f-525b-8218-59627be7d149"),
  ProductID: UUID("af8561cb-fd5f-5c69-84a8-d4fc7608ca2b"),
  ProductQuantity: 11
},
{
  LocationID: UUID("290c4f1f-5b00-5701-8ff1-407bfc08c780"),
  ProductID: UUID("7989d799-effa-5214-9205-b48e3d4ce254"),
  ProductQuantity: 7
},
{
  LocationID: UUID("9e70a202-0980-5679-87ca-f846d9be7f2c"),
  ProductID: UUID("7989d799-effa-5214-9205-b48e3d4ce254"),
  ProductQuantity: 5
},
{
  LocationID: UUID("3102e073-185b-59dd-bf30-e7bf18f1ef8e"),
  ProductID: UUID("7989d799-effa-5214-9205-b48e3d4ce254"),
  ProductQuantity: 10
},
{
  LocationID: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  ProductID: UUID("49837b1c-aeac-5661-8d07-a97adc41d851"),
  ProductQuantity: 6
},
{
  LocationID: UUID("290c4f1f-5b00-5701-8ff1-407bfc08c780"),
  ProductID: UUID("49837b1c-aeac-5661-8d07-a97adc41d851"),
  ProductQuantity: 4
},
{
  LocationID: UUID("290c4f1f-5b00-5701-8ff1-407bfc08c780"),
  ProductID: UUID("241ce5fb-54ae-554f-b6f7-6edfa6a4290e"),
  ProductQuantity: 3
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("f29e8709-5006-5eb5-b95a-bb656d0db629"),
  ProductQuantity: 1
},
{
  LocationID: UUID("a36ec316-987f-597b-aaad-8f3b9905806c"),
  ProductID: UUID("888a2181-f7c0-5886-8f08-fea73f0c0b12"),
  ProductQuantity: 4
},
{
  LocationID: UUID("290c4f1f-5b00-5701-8ff1-407bfc08c780"),
  ProductID: UUID("888a2181-f7c0-5886-8f08-fea73f0c0b12"),
  ProductQuantity: 2
},
{
  LocationID: UUID("bdba8210-6d58-5bea-9828-cc02be235571"),
  ProductID: UUID("1296c8f3-4c34-58bd-8fa5-58e65c09dc6b"),
  ProductQuantity: 0
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("069fefd7-707c-59e7-a809-b4e2bcda0482"),
  ProductQuantity: 10
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("069fefd7-707c-59e7-a809-b4e2bcda0482"),
  ProductQuantity: 7
},
{
  LocationID: UUID("4863ca60-8dbe-597f-9482-b44df88d7930"),
  ProductID: UUID("069fefd7-707c-59e7-a809-b4e2bcda0482"),
  ProductQuantity: 13
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("4ddeb0e5-975c-5777-82c6-602057f15e41"),
  ProductQuantity: 9
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("4ddeb0e5-975c-5777-82c6-602057f15e41"),
  ProductQuantity: 7
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("4ddeb0e5-975c-5777-82c6-602057f15e41"),
  ProductQuantity: 12
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("fc9744f3-b31a-51a4-a760-d3d049d8f8f1"),
  ProductQuantity: 6
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("fc9744f3-b31a-51a4-a760-d3d049d8f8f1"),
  ProductQuantity: 4
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("fc9744f3-b31a-51a4-a760-d3d049d8f8f1"),
  ProductQuantity: 8
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("6f81d746-9038-5d87-b0ab-1c40cac51de0"),
  ProductQuantity: 15
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("6f81d746-9038-5d87-b0ab-1c40cac51de0"),
  ProductQuantity: 11
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("6f81d746-9038-5d87-b0ab-1c40cac51de0"),
  ProductQuantity: 19
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("26ac85a1-197a-5273-80d6-c7a0f829b34d"),
  ProductQuantity: 18
},
{
  LocationID: UUID("4863ca60-8dbe-597f-9482-b44df88d7930"),
  ProductID: UUID("26ac85a1-197a-5273-80d6-c7a0f829b34d"),
  ProductQuantity: 13
},
{
  LocationID: UUID("560de5b9-d5fd-5f38-8189-d70fe93f9181"),
  ProductID: UUID("26ac85a1-197a-5273-80d6-c7a0f829b34d"),
  ProductQuantity: 21
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("97e97f84-88e5-5221-a6f1-434d1566bbcb"),
  ProductQuantity: 13
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("97e97f84-88e5-5221-a6f1-434d1566bbcb"),
  ProductQuantity: 9
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("97e97f84-88e5-5221-a6f1-434d1566bbcb"),
  ProductQuantity: 16
},
{
  LocationID: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  ProductID: UUID("3377495b-f6e6-5b19-aacd-dd4ddce972b4"),
  ProductQuantity: 11
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("3377495b-f6e6-5b19-aacd-dd4ddce972b4"),
  ProductQuantity: 8
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("3377495b-f6e6-5b19-aacd-dd4ddce972b4"),
  ProductQuantity: 14
},
{
  LocationID: UUID("560de5b9-d5fd-5f38-8189-d70fe93f9181"),
  ProductID: UUID("65b879b6-a61c-5043-af71-62a7958a4713"),
  ProductQuantity: 14
},
{
  LocationID: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  ProductID: UUID("65b879b6-a61c-5043-af71-62a7958a4713"),
  ProductQuantity: 10
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("65b879b6-a61c-5043-af71-62a7958a4713"),
  ProductQuantity: 16
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("a7f088ef-23fc-557f-b470-818b2c999819"),
  ProductQuantity: 5
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("a7f088ef-23fc-557f-b470-818b2c999819"),
  ProductQuantity: 4
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("a7f088ef-23fc-557f-b470-818b2c999819"),
  ProductQuantity: 8
},
{
  LocationID: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  ProductID: UUID("d37e1ce4-6ae2-5d76-85ad-67959bcf03a1"),
  ProductQuantity: 3
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("d37e1ce4-6ae2-5d76-85ad-67959bcf03a1"),
  ProductQuantity: 1
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  ProductQuantity: 8
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  ProductQuantity: 6
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  ProductQuantity: 10
},
{
  LocationID: UUID("4863ca60-8dbe-597f-9482-b44df88d7930"),
  ProductID: UUID("701b3743-5c98-5e45-8a81-ee8bf769ea15"),
  ProductQuantity: 6
},
{
  LocationID: UUID("560de5b9-d5fd-5f38-8189-d70fe93f9181"),
  ProductID: UUID("701b3743-5c98-5e45-8a81-ee8bf769ea15"),
  ProductQuantity: 4
},
{
  LocationID: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  ProductID: UUID("701b3743-5c98-5e45-8a81-ee8bf769ea15"),
  ProductQuantity: 9
},
{
  LocationID: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  ProductID: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  ProductQuantity: 7
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  ProductQuantity: 5
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  ProductQuantity: 9
},
{
  LocationID: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  ProductID: UUID("53af2937-b05b-5753-a125-cf664bb7ba8b"),
  ProductQuantity: 12
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("53af2937-b05b-5753-a125-cf664bb7ba8b"),
  ProductQuantity: 9
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("53af2937-b05b-5753-a125-cf664bb7ba8b"),
  ProductQuantity: 15
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("eacd521b-981a-5879-9c4e-4bc19faa7d6e"),
  ProductQuantity: 10
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("eacd521b-981a-5879-9c4e-4bc19faa7d6e"),
  ProductQuantity: 7
},
{
  LocationID: UUID("4863ca60-8dbe-597f-9482-b44df88d7930"),
  ProductID: UUID("eacd521b-981a-5879-9c4e-4bc19faa7d6e"),
  ProductQuantity: 14
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("3611640a-7c2c-5211-93bd-93e7ee9b55fc"),
  ProductQuantity: 7
},
{
  LocationID: UUID("4863ca60-8dbe-597f-9482-b44df88d7930"),
  ProductID: UUID("3611640a-7c2c-5211-93bd-93e7ee9b55fc"),
  ProductQuantity: 5
},
{
  LocationID: UUID("560de5b9-d5fd-5f38-8189-d70fe93f9181"),
  ProductID: UUID("3611640a-7c2c-5211-93bd-93e7ee9b55fc"),
  ProductQuantity: 8
},
{
  LocationID: UUID("e1298768-f893-5231-8887-d9b8e9286c5d"),
  ProductID: UUID("d0daaeb5-7169-5bf2-adfb-9ef7149a0fd7"),
  ProductQuantity: 6
},
{
  LocationID: UUID("4863ca60-8dbe-597f-9482-b44df88d7930"),
  ProductID: UUID("d0daaeb5-7169-5bf2-adfb-9ef7149a0fd7"),
  ProductQuantity: 4
},
{
  LocationID: UUID("560de5b9-d5fd-5f38-8189-d70fe93f9181"),
  ProductID: UUID("d0daaeb5-7169-5bf2-adfb-9ef7149a0fd7"),
  ProductQuantity: 8
},
{
  LocationID: UUID("803f2419-2cbe-50ed-b08c-dc013f845459"),
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  ProductQuantity: 5
},
{
  LocationID: UUID("9524748f-7232-5038-85b5-0f69fcd785f6"),
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  ProductQuantity: 4
},
{
  LocationID: UUID("2e237553-a5e2-58c8-80e1-cd9067d86788"),
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  ProductQuantity: 7
}
];
database.getCollection("product-locations").insertMany(product_locations);

const customers = [
{
  _id: UUID("0e7a535f-0698-5033-a5cf-aa1db46219e3"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Иван",
  CustomerLastname: "Петров",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Энтузиастов, д. 10",
  CustomerPhone: "+7-928-700-10-20",
  CustomerEmail: "client1@mail.local"
},
{
  _id: UUID("27d0ede2-b2eb-5a55-90c4-fd47a01167cb"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Мария",
  CustomerLastname: "Иванова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Ленина, д. 11",
  CustomerPhone: "+7-928-700-11-21",
  CustomerEmail: "client2@mail.local"
},
{
  _id: UUID("50280baa-ec35-5d94-b01d-97fe3894f479"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Ольга",
  CustomerLastname: "Смирнова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Морская, д. 12",
  CustomerPhone: "+7-928-700-12-22",
  CustomerEmail: "client3@mail.local"
},
{
  _id: UUID("0f7e1994-39d7-5629-b423-dd98ea1eb8f6"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Дмитрий",
  CustomerLastname: "Ковалев",
  CustomerAddress: "Ростовская обл., г. Волгодонск, пр-кт Строителей, д. 13",
  CustomerPhone: "+7-928-700-13-23",
  CustomerEmail: "client4@mail.local"
},
{
  _id: UUID("311d186c-77bd-58d1-803d-a3baa5832f13"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Екатерина",
  CustomerLastname: "Федорова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Молодежная, д. 14",
  CustomerPhone: "+7-928-700-14-24",
  CustomerEmail: "client5@mail.local"
},
{
  _id: UUID("60a755b5-84ff-5ebc-a6da-9a6572f09944"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Сергей",
  CustomerLastname: "Кузьмин",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Гагарина, д. 15",
  CustomerPhone: "+7-928-700-15-25",
  CustomerEmail: "client6@mail.local"
},
{
  _id: UUID("d46acdf7-49f5-5ebe-8efe-05c042126b5d"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Наталья",
  CustomerLastname: "Савельева",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Дружбы, д. 16",
  CustomerPhone: "+7-928-700-16-26",
  CustomerEmail: "client7@mail.local"
},
{
  _id: UUID("b18d48ec-4de1-50cf-91a0-af72c3a8ead9"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Андрей",
  CustomerLastname: "Морозов",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Маршала Кошевого, д. 17",
  CustomerPhone: "+7-928-700-17-27",
  CustomerEmail: "client8@mail.local"
},
{
  _id: UUID("07aa6c51-3c43-5210-a64e-58cc831fd859"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Татьяна",
  CustomerLastname: "Герасимова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Черникова, д. 18",
  CustomerPhone: "+7-928-700-18-28",
  CustomerEmail: "client9@mail.local"
},
{
  _id: UUID("b9497a2f-b7b0-59ee-b4c2-20b52401a922"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Александр",
  CustomerLastname: "Орлов",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. 30 лет Победы, д. 19",
  CustomerPhone: "+7-928-700-19-29",
  CustomerEmail: "client10@mail.local"
},
{
  _id: UUID("3f9a0889-9fe6-5607-b1d3-105119a109b8"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Светлана",
  CustomerLastname: "Комарова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Энтузиастов, д. 20",
  CustomerPhone: "+7-928-700-20-30",
  CustomerEmail: "client11@mail.local"
},
{
  _id: UUID("2c520ea9-d080-5154-a5a8-366849a022af"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Николай",
  CustomerLastname: "Гусев",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Ленина, д. 21",
  CustomerPhone: "+7-928-700-21-31",
  CustomerEmail: "client12@mail.local"
},
{
  _id: UUID("be71a251-86d5-57cf-a179-974a07d23db1"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Юлия",
  CustomerLastname: "Захарова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Морская, д. 22",
  CustomerPhone: "+7-928-700-22-32",
  CustomerEmail: "client13@mail.local"
},
{
  _id: UUID("f92735c9-c5d1-541b-a4cb-03b2c9872cae"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Максим",
  CustomerLastname: "Титов",
  CustomerAddress: "Ростовская обл., г. Волгодонск, пр-кт Строителей, д. 23",
  CustomerPhone: "+7-928-700-23-33",
  CustomerEmail: "client14@mail.local"
},
{
  _id: UUID("edb05489-090e-57db-8c0d-f9c3c9d68797"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Виктория",
  CustomerLastname: "Мельникова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Молодежная, д. 24",
  CustomerPhone: "+7-928-700-24-34",
  CustomerEmail: "client15@mail.local"
},
{
  _id: UUID("30e8fc0e-b850-5899-b644-6eca25b03a5a"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Роман",
  CustomerLastname: "Абрамов",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Гагарина, д. 25",
  CustomerPhone: "+7-928-700-25-35",
  CustomerEmail: "client16@mail.local"
},
{
  _id: UUID("cf7f6c03-fd3b-5a1d-ba4d-26f155e40cfc"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Людмила",
  CustomerLastname: "Осипова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Дружбы, д. 26",
  CustomerPhone: "+7-928-700-26-36",
  CustomerEmail: "client17@mail.local"
},
{
  _id: UUID("0c69b0d1-b441-53c4-bc1e-f5c305d8da33"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Кирилл",
  CustomerLastname: "Белов",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Маршала Кошевого, д. 27",
  CustomerPhone: "+7-928-700-27-37",
  CustomerEmail: "client18@mail.local"
},
{
  _id: UUID("42b3b7f2-e52a-5a61-9c2a-73fd128d1b95"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Анна",
  CustomerLastname: "Романова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Черникова, д. 28",
  CustomerPhone: "+7-928-700-28-38",
  CustomerEmail: "client19@mail.local"
},
{
  _id: UUID("bdd2217a-e62b-57c0-8b50-abdc93035b42"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Владимир",
  CustomerLastname: "Ефимов",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. 30 лет Победы, д. 29",
  CustomerPhone: "+7-928-700-29-39",
  CustomerEmail: "client20@mail.local"
},
{
  _id: UUID("8f5896b5-e6f4-52e0-8e20-2e4fbceb08cd"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Ирина",
  CustomerLastname: "Калинина",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Энтузиастов, д. 30",
  CustomerPhone: "+7-928-700-30-40",
  CustomerEmail: "client21@mail.local"
},
{
  _id: UUID("388d2cf0-81c8-5583-9bde-a54d0291d5a0"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  CustomerFirstname: "Олег",
  CustomerLastname: "Носов",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Ленина, д. 31",
  CustomerPhone: "+7-928-700-31-41",
  CustomerEmail: "client22@mail.local"
},
{
  _id: UUID("1ccacb1d-cc3d-51b3-ac13-a36c4a813862"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  CustomerFirstname: "Полина",
  CustomerLastname: "Семенова",
  CustomerAddress: "Ростовская обл., г. Волгодонск, ул. Морская, д. 32",
  CustomerPhone: "+7-928-700-32-42",
  CustomerEmail: "client23@mail.local"
},
{
  _id: UUID("def615ca-9cc9-5446-a597-11ca0d40fadc"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  CustomerFirstname: "Михаил",
  CustomerLastname: "Гордеев",
  CustomerAddress: "Ростовская обл., г. Волгодонск, пр-кт Строителей, д. 33",
  CustomerPhone: "+7-928-700-33-43",
  CustomerEmail: "client24@mail.local"
}
];
database.getCollection("customers").insertMany(customers);

const orders = [
{
  _id: UUID("dd69d17a-304c-55eb-96b9-657919e4d42b"),
  CustomerID: UUID("0f7e1994-39d7-5629-b423-dd98ea1eb8f6"),
  OrderDate: ISODate("2026-02-10T11:41:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("4890.00")
},
{
  _id: UUID("085f2e11-08b0-5e5e-810d-b2f97ce90d7d"),
  CustomerID: UUID("b18d48ec-4de1-50cf-91a0-af72c3a8ead9"),
  OrderDate: ISODate("2026-02-10T10:37:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("2800.00")
},
{
  _id: UUID("cb85e1e0-e85e-5c28-b74c-0b69e2fcc21e"),
  CustomerID: UUID("b9497a2f-b7b0-59ee-b4c2-20b52401a922"),
  OrderDate: ISODate("2026-02-12T10:52:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3780.00")
},
{
  _id: UUID("d4e616da-1a08-5ca7-b1a4-51cfac7b6b32"),
  CustomerID: UUID("be71a251-86d5-57cf-a179-974a07d23db1"),
  OrderDate: ISODate("2026-02-13T15:41:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3380.00")
},
{
  _id: UUID("e3fa598a-133a-5a4b-9719-fc769bd72aec"),
  CustomerID: UUID("30e8fc0e-b850-5899-b644-6eca25b03a5a"),
  OrderDate: ISODate("2026-02-16T11:37:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("1280.00")
},
{
  _id: UUID("f59eb226-dd08-5c29-a1d4-e3d4bbcbd024"),
  CustomerID: UUID("bdd2217a-e62b-57c0-8b50-abdc93035b42"),
  OrderDate: ISODate("2026-02-16T10:44:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("2390.00")
},
{
  _id: UUID("8abe3c9f-6349-5319-a920-5dd7befdd5ff"),
  CustomerID: UUID("388d2cf0-81c8-5583-9bde-a54d0291d5a0"),
  OrderDate: ISODate("2026-02-17T17:44:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("5090.00")
},
{
  _id: UUID("9ae638b5-4144-55c9-9398-ec8884ca183f"),
  CustomerID: UUID("0e7a535f-0698-5033-a5cf-aa1db46219e3"),
  OrderDate: ISODate("2026-02-23T16:22:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3770.00")
},
{
  _id: UUID("6d3e031a-dd8c-5b09-ac74-ebdfa7ed22d2"),
  CustomerID: UUID("0f7e1994-39d7-5629-b423-dd98ea1eb8f6"),
  OrderDate: ISODate("2026-02-24T15:17:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("4090.00")
},
{
  _id: UUID("514eb9fa-62e4-5653-bd8f-52b6d7b27b8b"),
  CustomerID: UUID("d46acdf7-49f5-5ebe-8efe-05c042126b5d"),
  OrderDate: ISODate("2026-02-25T16:41:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("9570.00")
},
{
  _id: UUID("78c1978a-0877-5383-95ef-4bdc7d5a7c58"),
  CustomerID: UUID("3f9a0889-9fe6-5607-b1d3-105119a109b8"),
  OrderDate: ISODate("2026-02-25T10:56:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("2700.00")
},
{
  _id: UUID("ad0959a7-9a24-528f-90df-cb6aaa31f205"),
  CustomerID: UUID("be71a251-86d5-57cf-a179-974a07d23db1"),
  OrderDate: ISODate("2026-02-26T17:37:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("1290.00")
},
{
  _id: UUID("c17d7386-9d94-5545-9609-a9d10fd99d70"),
  CustomerID: UUID("30e8fc0e-b850-5899-b644-6eca25b03a5a"),
  OrderDate: ISODate("2026-02-27T14:52:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3470.00")
},
{
  _id: UUID("0044cde7-12b4-50d8-a01c-18d85712ff01"),
  CustomerID: UUID("42b3b7f2-e52a-5a61-9c2a-73fd128d1b95"),
  OrderDate: ISODate("2026-03-04T14:56:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("6200.00")
},
{
  _id: UUID("7a1e5c56-a69e-5984-a208-1ae0cf31c918"),
  CustomerID: UUID("388d2cf0-81c8-5583-9bde-a54d0291d5a0"),
  OrderDate: ISODate("2026-03-06T11:26:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3300.00")
},
{
  _id: UUID("a900ab77-c454-5ac7-9a4f-6b14cbdaf6db"),
  CustomerID: UUID("0e7a535f-0698-5033-a5cf-aa1db46219e3"),
  OrderDate: ISODate("2026-03-09T12:22:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3160.00")
},
{
  _id: UUID("6b820c4c-54ef-5e30-b810-aef3ce84092f"),
  CustomerID: UUID("0f7e1994-39d7-5629-b423-dd98ea1eb8f6"),
  OrderDate: ISODate("2026-03-10T11:17:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("31200.00")
},
{
  _id: UUID("b612091f-6703-5518-8a78-da6e932b72c1"),
  CustomerID: UUID("d46acdf7-49f5-5ebe-8efe-05c042126b5d"),
  OrderDate: ISODate("2026-03-11T10:11:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("5360.00")
},
{
  _id: UUID("5f1227a4-0ead-5c1c-95f3-d3306123c044"),
  CustomerID: UUID("b9497a2f-b7b0-59ee-b4c2-20b52401a922"),
  OrderDate: ISODate("2026-03-12T12:47:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("5270.00")
},
{
  _id: UUID("deaad6fb-e671-54f8-88ef-e93787a866b5"),
  CustomerID: UUID("be71a251-86d5-57cf-a179-974a07d23db1"),
  OrderDate: ISODate("2026-03-13T10:44:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("15460.00")
},
{
  _id: UUID("4edc157b-d35d-5ab1-855d-c8e506b1cc1e"),
  CustomerID: UUID("30e8fc0e-b850-5899-b644-6eca25b03a5a"),
  OrderDate: ISODate("2026-03-16T14:34:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("2600.00")
},
{
  _id: UUID("3b6f0a35-7b0c-5618-99f0-858fc9082c9c"),
  CustomerID: UUID("42b3b7f2-e52a-5a61-9c2a-73fd128d1b95"),
  OrderDate: ISODate("2026-03-17T10:11:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("5860.00")
},
{
  _id: UUID("d50a3336-2466-542b-8587-a54640a7dab7"),
  CustomerID: UUID("1ccacb1d-cc3d-51b3-ac13-a36c4a813862"),
  OrderDate: ISODate("2026-03-17T17:22:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("2800.00")
},
{
  _id: UUID("1a4c2ff4-61e2-5d0d-b6de-749650f8b960"),
  CustomerID: UUID("0e7a535f-0698-5033-a5cf-aa1db46219e3"),
  OrderDate: ISODate("2026-03-18T10:41:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("6660.00")
},
{
  _id: UUID("2e43059f-c7ca-569e-b508-cd2082892fa9"),
  CustomerID: UUID("0f7e1994-39d7-5629-b423-dd98ea1eb8f6"),
  OrderDate: ISODate("2026-03-19T12:11:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("8860.00")
},
{
  _id: UUID("f87ed5ce-6c07-5e50-86aa-bdf03b94f712"),
  CustomerID: UUID("d46acdf7-49f5-5ebe-8efe-05c042126b5d"),
  OrderDate: ISODate("2026-03-20T15:22:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("960.00")
},
{
  _id: UUID("1bd943e9-4a96-5b89-91b1-68d355f07426"),
  CustomerID: UUID("b9497a2f-b7b0-59ee-b4c2-20b52401a922"),
  OrderDate: ISODate("2026-03-23T14:34:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("690.00")
},
{
  _id: UUID("b0f203b8-7938-585b-bfe3-592ffc110b90"),
  CustomerID: UUID("f92735c9-c5d1-541b-a4cb-03b2c9872cae"),
  OrderDate: ISODate("2026-03-23T11:11:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3210.00")
},
{
  _id: UUID("2052972c-8c60-5d8a-8b9e-af180d3fd5a5"),
  CustomerID: UUID("30e8fc0e-b850-5899-b644-6eca25b03a5a"),
  OrderDate: ISODate("2026-03-24T14:41:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("37070.00")
},
{
  _id: UUID("88d99e92-c60e-58c6-a315-ab7bd0d877d8"),
  CustomerID: UUID("bdd2217a-e62b-57c0-8b50-abdc93035b42"),
  OrderDate: ISODate("2026-03-24T13:47:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("4450.00")
},
{
  _id: UUID("7fbb4654-9416-50ab-a124-4fc8e99d1b6a"),
  CustomerID: UUID("388d2cf0-81c8-5583-9bde-a54d0291d5a0"),
  OrderDate: ISODate("2026-03-25T10:11:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("5370.00")
},
{
  _id: UUID("d3675840-9fb1-5633-8ea9-d17c1d463a72"),
  CustomerID: UUID("27d0ede2-b2eb-5a55-90c4-fd47a01167cb"),
  OrderDate: ISODate("2026-03-25T11:11:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("5130.00")
},
{
  _id: UUID("58a7f5a0-a3dc-5a37-ac32-1cda02e2e39e"),
  CustomerID: UUID("0f7e1994-39d7-5629-b423-dd98ea1eb8f6"),
  OrderDate: ISODate("2026-03-26T10:26:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("3580.00")
},
{
  _id: UUID("48b110d4-a678-5117-8241-06bb1abe027c"),
  CustomerID: UUID("d46acdf7-49f5-5ebe-8efe-05c042126b5d"),
  OrderDate: ISODate("2026-03-27T16:41:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("6500.00")
},
{
  _id: UUID("21c72de8-c537-59b5-b831-363f790d443a"),
  CustomerID: UUID("3f9a0889-9fe6-5607-b1d3-105119a109b8"),
  OrderDate: ISODate("2026-03-27T13:22:00"),
  DeliveryStatus: "Shipped",
  OrderTotal: NumberDecimal("680.00")
},
{
  _id: UUID("aaf3e39b-b1c8-59ef-8190-5a1b20231d41"),
  CustomerID: UUID("be71a251-86d5-57cf-a179-974a07d23db1"),
  OrderDate: ISODate("2026-03-30T17:26:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("640.00")
},
{
  _id: UUID("3f63cc7c-050d-54b7-b4f6-02251b1f78d0"),
  CustomerID: UUID("30e8fc0e-b850-5899-b644-6eca25b03a5a"),
  OrderDate: ISODate("2026-03-31T15:22:00"),
  DeliveryStatus: "Shipped",
  OrderTotal: NumberDecimal("39160.00")
},
{
  _id: UUID("e9f24d80-36cb-5ff1-a201-2079f4c9ac0a"),
  CustomerID: UUID("42b3b7f2-e52a-5a61-9c2a-73fd128d1b95"),
  OrderDate: ISODate("2026-04-01T14:07:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("1580.00")
},
{
  _id: UUID("46badf24-c263-5b5b-b9dc-8bed89abfa73"),
  CustomerID: UUID("388d2cf0-81c8-5583-9bde-a54d0291d5a0"),
  OrderDate: ISODate("2026-04-02T16:41:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("1090.00")
},
{
  _id: UUID("dfaad59c-c44e-5f50-968d-de66ec7bd188"),
  CustomerID: UUID("0e7a535f-0698-5033-a5cf-aa1db46219e3"),
  OrderDate: ISODate("2026-04-03T13:26:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("1770.00")
},
{
  _id: UUID("4a0e8617-7dd9-5417-a185-63d6515eb85a"),
  CustomerID: UUID("311d186c-77bd-58d1-803d-a3baa5832f13"),
  OrderDate: ISODate("2026-04-03T11:47:00"),
  DeliveryStatus: "Delivered",
  OrderTotal: NumberDecimal("4070.00")
},
{
  _id: UUID("9eae0b19-88d8-5593-ad9b-a6c620022a91"),
  CustomerID: UUID("d46acdf7-49f5-5ebe-8efe-05c042126b5d"),
  OrderDate: ISODate("2026-04-06T16:44:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("7380.00")
},
{
  _id: UUID("489aaff9-3428-545d-aef4-ff5035b36abe"),
  CustomerID: UUID("3f9a0889-9fe6-5607-b1d3-105119a109b8"),
  OrderDate: ISODate("2026-04-06T15:34:00"),
  DeliveryStatus: "Shipped",
  OrderTotal: NumberDecimal("1150.00")
},
{
  _id: UUID("45f964d1-74f7-55d7-938b-9cfe7b30324f"),
  CustomerID: UUID("be71a251-86d5-57cf-a179-974a07d23db1"),
  OrderDate: ISODate("2026-04-08T12:44:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("8970.00")
},
{
  _id: UUID("783aa2b0-c7df-5954-8816-72572b155488"),
  CustomerID: UUID("cf7f6c03-fd3b-5a1d-ba4d-26f155e40cfc"),
  OrderDate: ISODate("2026-04-08T13:44:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("430.00")
},
{
  _id: UUID("52e85847-a270-5931-8b54-7d1e7dd1df93"),
  CustomerID: UUID("42b3b7f2-e52a-5a61-9c2a-73fd128d1b95"),
  OrderDate: ISODate("2026-04-09T11:34:00"),
  DeliveryStatus: "Shipped",
  OrderTotal: NumberDecimal("1750.00")
},
{
  _id: UUID("9e2ddb34-3246-57c9-8f2a-b7a8501d2460"),
  CustomerID: UUID("1ccacb1d-cc3d-51b3-ac13-a36c4a813862"),
  OrderDate: ISODate("2026-04-09T13:13:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("6330.00")
},
{
  _id: UUID("9ffeeade-bc9c-5dad-b9dd-36a64f7ba470"),
  CustomerID: UUID("0e7a535f-0698-5033-a5cf-aa1db46219e3"),
  OrderDate: ISODate("2026-04-10T11:34:00"),
  DeliveryStatus: "Shipped",
  OrderTotal: NumberDecimal("6570.00")
},
{
  _id: UUID("be68bdc0-8832-5e2e-b650-0cda1e0a7c35"),
  CustomerID: UUID("0f7e1994-39d7-5629-b423-dd98ea1eb8f6"),
  OrderDate: ISODate("2026-04-13T17:41:00"),
  DeliveryStatus: "Shipped",
  OrderTotal: NumberDecimal("35260.00")
},
{
  _id: UUID("bc36e9f1-f417-5a0c-a7d4-8b271ee71146"),
  CustomerID: UUID("b18d48ec-4de1-50cf-91a0-af72c3a8ead9"),
  OrderDate: ISODate("2026-04-13T17:44:00"),
  DeliveryStatus: "Processing",
  OrderTotal: NumberDecimal("890.00")
},
{
  _id: UUID("894db47b-ded7-5a83-b269-8c3531cb9b0f"),
  CustomerID: UUID("b9497a2f-b7b0-59ee-b4c2-20b52401a922"),
  OrderDate: ISODate("2026-04-14T11:13:00"),
  DeliveryStatus: "Processing",
  OrderTotal: NumberDecimal("3190.00")
},
{
  _id: UUID("2e883132-fb6e-5e5c-bad4-c31542f90acd"),
  CustomerID: UUID("be71a251-86d5-57cf-a179-974a07d23db1"),
  OrderDate: ISODate("2026-04-15T17:29:00"),
  DeliveryStatus: "In Transit",
  OrderTotal: NumberDecimal("680.00")
}
];
database.getCollection("orders").insertMany(orders);

const order_details = [
{
  ProductID: UUID("550a6126-9886-5858-b6f6-58deebd3a657"),
  OrderID: UUID("dd69d17a-304c-55eb-96b9-657919e4d42b"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("4890.00")
},
{
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  OrderID: UUID("085f2e11-08b0-5e5e-810d-b2f97ce90d7d"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("2800.00")
},
{
  ProductID: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  OrderID: UUID("cb85e1e0-e85e-5c28-b74c-0b69e2fcc21e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("3190.00")
},
{
  ProductID: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  OrderID: UUID("cb85e1e0-e85e-5c28-b74c-0b69e2fcc21e"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("590.00")
},
{
  ProductID: UUID("af8561cb-fd5f-5c69-84a8-d4fc7608ca2b"),
  OrderID: UUID("d4e616da-1a08-5ca7-b1a4-51cfac7b6b32"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("3380.00")
},
{
  ProductID: UUID("701b3743-5c98-5e45-8a81-ee8bf769ea15"),
  OrderID: UUID("e3fa598a-133a-5a4b-9719-fc769bd72aec"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1280.00")
},
{
  ProductID: UUID("2e7ca414-836f-5174-8c7c-4455fb580cd4"),
  OrderID: UUID("f59eb226-dd08-5c29-a1d4-e3d4bbcbd024"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("2390.00")
},
{
  ProductID: UUID("2a4f1de8-b2eb-555e-a7d4-6e8c6fbd1d70"),
  OrderID: UUID("8abe3c9f-6349-5319-a920-5dd7befdd5ff"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("990.00")
},
{
  ProductID: UUID("97e97f84-88e5-5221-a6f1-434d1566bbcb"),
  OrderID: UUID("8abe3c9f-6349-5319-a920-5dd7befdd5ff"),
  OrderDetailQuantity: 10,
  OrderDetailAmount: NumberDecimal("4100.00")
},
{
  ProductID: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  OrderID: UUID("9ae638b5-4144-55c9-9398-ec8884ca183f"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("790.00")
},
{
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  OrderID: UUID("9ae638b5-4144-55c9-9398-ec8884ca183f"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("2980.00")
},
{
  ProductID: UUID("eacd521b-981a-5879-9c4e-4bc19faa7d6e"),
  OrderID: UUID("6d3e031a-dd8c-5b09-ac74-ebdfa7ed22d2"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("520.00")
},
{
  ProductID: UUID("c2d3ccfe-6b55-519a-86e4-12b0d73f39f8"),
  OrderID: UUID("6d3e031a-dd8c-5b09-ac74-ebdfa7ed22d2"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("3570.00")
},
{
  ProductID: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  OrderID: UUID("514eb9fa-62e4-5653-bd8f-52b6d7b27b8b"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("9570.00")
},
{
  ProductID: UUID("53af2937-b05b-5753-a125-cf664bb7ba8b"),
  OrderID: UUID("78c1978a-0877-5383-95ef-4bdc7d5a7c58"),
  OrderDetailQuantity: 10,
  OrderDetailAmount: NumberDecimal("2700.00")
},
{
  ProductID: UUID("7f840b26-94e7-587e-9774-1f6e376bdfb2"),
  OrderID: UUID("ad0959a7-9a24-528f-90df-cb6aaa31f205"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1290.00")
},
{
  ProductID: UUID("af8561cb-fd5f-5c69-84a8-d4fc7608ca2b"),
  OrderID: UUID("c17d7386-9d94-5545-9609-a9d10fd99d70"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1690.00")
},
{
  ProductID: UUID("a7f088ef-23fc-557f-b470-818b2c999819"),
  OrderID: UUID("c17d7386-9d94-5545-9609-a9d10fd99d70"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1780.00")
},
{
  ProductID: UUID("982ce262-b2ce-5167-b85e-1d84783d4ebc"),
  OrderID: UUID("0044cde7-12b4-50d8-a01c-18d85712ff01"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("5970.00")
},
{
  ProductID: UUID("d0daaeb5-7169-5bf2-adfb-9ef7149a0fd7"),
  OrderID: UUID("0044cde7-12b4-50d8-a01c-18d85712ff01"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("230.00")
},
{
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  OrderID: UUID("7a1e5c56-a69e-5984-a208-1ae0cf31c918"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1490.00")
},
{
  ProductID: UUID("fc9744f3-b31a-51a4-a760-d3d049d8f8f1"),
  OrderID: UUID("7a1e5c56-a69e-5984-a208-1ae0cf31c918"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("690.00")
},
{
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  OrderID: UUID("7a1e5c56-a69e-5984-a208-1ae0cf31c918"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1120.00")
},
{
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  OrderID: UUID("a900ab77-c454-5ac7-9a4f-6b14cbdaf6db"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1120.00")
},
{
  ProductID: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  OrderID: UUID("a900ab77-c454-5ac7-9a4f-6b14cbdaf6db"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("2040.00")
},
{
  ProductID: UUID("f29e8709-5006-5eb5-b95a-bb656d0db629"),
  OrderID: UUID("6b820c4c-54ef-5e30-b810-aef3ce84092f"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("31200.00")
},
{
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  OrderID: UUID("b612091f-6703-5518-8a78-da6e932b72c1"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("2980.00")
},
{
  ProductID: UUID("c2d3ccfe-6b55-519a-86e4-12b0d73f39f8"),
  OrderID: UUID("b612091f-6703-5518-8a78-da6e932b72c1"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("2380.00")
},
{
  ProductID: UUID("7989d799-effa-5214-9205-b48e3d4ce254"),
  OrderID: UUID("5f1227a4-0ead-5c1c-95f3-d3306123c044"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1690.00")
},
{
  ProductID: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  OrderID: UUID("5f1227a4-0ead-5c1c-95f3-d3306123c044"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("3580.00")
},
{
  ProductID: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  OrderID: UUID("deaad6fb-e671-54f8-88ef-e93787a866b5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("790.00")
},
{
  ProductID: UUID("550a6126-9886-5858-b6f6-58deebd3a657"),
  OrderID: UUID("deaad6fb-e671-54f8-88ef-e93787a866b5"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("14670.00")
},
{
  ProductID: UUID("eacd521b-981a-5879-9c4e-4bc19faa7d6e"),
  OrderID: UUID("4edc157b-d35d-5ab1-855d-c8e506b1cc1e"),
  OrderDetailQuantity: 10,
  OrderDetailAmount: NumberDecimal("2600.00")
},
{
  ProductID: UUID("7989d799-effa-5214-9205-b48e3d4ce254"),
  OrderID: UUID("3b6f0a35-7b0c-5618-99f0-858fc9082c9c"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1690.00")
},
{
  ProductID: UUID("32515653-1be6-534a-9670-2a4333191e00"),
  OrderID: UUID("3b6f0a35-7b0c-5618-99f0-858fc9082c9c"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1590.00")
},
{
  ProductID: UUID("7f840b26-94e7-587e-9774-1f6e376bdfb2"),
  OrderID: UUID("3b6f0a35-7b0c-5618-99f0-858fc9082c9c"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("2580.00")
},
{
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  OrderID: UUID("d50a3336-2466-542b-8587-a54640a7dab7"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("2800.00")
},
{
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  OrderID: UUID("1a4c2ff4-61e2-5d0d-b6de-749650f8b960"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("4470.00")
},
{
  ProductID: UUID("49837b1c-aeac-5661-8d07-a97adc41d851"),
  OrderID: UUID("1a4c2ff4-61e2-5d0d-b6de-749650f8b960"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("2190.00")
},
{
  ProductID: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  OrderID: UUID("2e43059f-c7ca-569e-b508-cd2082892fa9"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("5370.00")
},
{
  ProductID: UUID("888a2181-f7c0-5886-8f08-fea73f0c0b12"),
  OrderID: UUID("2e43059f-c7ca-569e-b508-cd2082892fa9"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("3490.00")
},
{
  ProductID: UUID("65b879b6-a61c-5043-af71-62a7958a4713"),
  OrderID: UUID("f87ed5ce-6c07-5e50-86aa-bdf03b94f712"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("960.00")
},
{
  ProductID: UUID("fc9744f3-b31a-51a4-a760-d3d049d8f8f1"),
  OrderID: UUID("1bd943e9-4a96-5b89-91b1-68d355f07426"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("690.00")
},
{
  ProductID: UUID("bb6b7911-678d-52c8-82a7-c5720b42c33b"),
  OrderID: UUID("b0f203b8-7938-585b-bfe3-592ffc110b90"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1290.00")
},
{
  ProductID: UUID("701b3743-5c98-5e45-8a81-ee8bf769ea15"),
  OrderID: UUID("b0f203b8-7938-585b-bfe3-592ffc110b90"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("1920.00")
},
{
  ProductID: UUID("241ce5fb-54ae-554f-b6f7-6edfa6a4290e"),
  OrderID: UUID("2052972c-8c60-5d8a-8b9e-af180d3fd5a5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("28900.00")
},
{
  ProductID: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  OrderID: UUID("2052972c-8c60-5d8a-8b9e-af180d3fd5a5"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1790.00")
},
{
  ProductID: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  OrderID: UUID("2052972c-8c60-5d8a-8b9e-af180d3fd5a5"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("6380.00")
},
{
  ProductID: UUID("a7f088ef-23fc-557f-b470-818b2c999819"),
  OrderID: UUID("88d99e92-c60e-58c6-a315-ab7bd0d877d8"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("4450.00")
},
{
  ProductID: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  OrderID: UUID("7fbb4654-9416-50ab-a124-4fc8e99d1b6a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("790.00")
},
{
  ProductID: UUID("a7f088ef-23fc-557f-b470-818b2c999819"),
  OrderID: UUID("7fbb4654-9416-50ab-a124-4fc8e99d1b6a"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1780.00")
},
{
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  OrderID: UUID("7fbb4654-9416-50ab-a124-4fc8e99d1b6a"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("2800.00")
},
{
  ProductID: UUID("649827b8-b97d-5e5e-a9fd-4b2d4ba7dc97"),
  OrderID: UUID("d3675840-9fb1-5633-8ea9-d17c1d463a72"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("2980.00")
},
{
  ProductID: UUID("26ac85a1-197a-5273-80d6-c7a0f829b34d"),
  OrderID: UUID("d3675840-9fb1-5633-8ea9-d17c1d463a72"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("2150.00")
},
{
  ProductID: UUID("74572931-fb31-5c98-a97a-97ba2a3916c0"),
  OrderID: UUID("58a7f5a0-a3dc-5a37-ac32-1cda02e2e39e"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("3580.00")
},
{
  ProductID: UUID("982ce262-b2ce-5167-b85e-1d84783d4ebc"),
  OrderID: UUID("48b110d4-a678-5117-8241-06bb1abe027c"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1990.00")
},
{
  ProductID: UUID("069fefd7-707c-59e7-a809-b4e2bcda0482"),
  OrderID: UUID("48b110d4-a678-5117-8241-06bb1abe027c"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1560.00")
},
{
  ProductID: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  OrderID: UUID("48b110d4-a678-5117-8241-06bb1abe027c"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("2950.00")
},
{
  ProductID: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  OrderID: UUID("21c72de8-c537-59b5-b831-363f790d443a"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("680.00")
},
{
  ProductID: UUID("65b879b6-a61c-5043-af71-62a7958a4713"),
  OrderID: UUID("aaf3e39b-b1c8-59ef-8190-5a1b20231d41"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("640.00")
},
{
  ProductID: UUID("1296c8f3-4c34-58bd-8fa5-58e65c09dc6b"),
  OrderID: UUID("3f63cc7c-050d-54b7-b4f6-02251b1f78d0"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("8970.00")
},
{
  ProductID: UUID("241ce5fb-54ae-554f-b6f7-6edfa6a4290e"),
  OrderID: UUID("3f63cc7c-050d-54b7-b4f6-02251b1f78d0"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("28900.00")
},
{
  ProductID: UUID("7f840b26-94e7-587e-9774-1f6e376bdfb2"),
  OrderID: UUID("3f63cc7c-050d-54b7-b4f6-02251b1f78d0"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1290.00")
},
{
  ProductID: UUID("ab86be50-e643-5b33-b52b-9491d0ea5680"),
  OrderID: UUID("e9f24d80-36cb-5ff1-a201-2079f4c9ac0a"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1580.00")
},
{
  ProductID: UUID("d64b3134-3e6b-5699-aa1c-26cdb6281567"),
  OrderID: UUID("46badf24-c263-5b5b-b9dc-8bed89abfa73"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("1090.00")
},
{
  ProductID: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  OrderID: UUID("dfaad59c-c44e-5f50-968d-de66ec7bd188"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("1770.00")
},
{
  ProductID: UUID("6fe3308e-c389-5ebb-9a49-ef010db52236"),
  OrderID: UUID("4a0e8617-7dd9-5417-a185-63d6515eb85a"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("2950.00")
},
{
  ProductID: UUID("1b1502de-1847-50b3-9520-8578915a3887"),
  OrderID: UUID("4a0e8617-7dd9-5417-a185-63d6515eb85a"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("1120.00")
},
{
  ProductID: UUID("32515653-1be6-534a-9670-2a4333191e00"),
  OrderID: UUID("9eae0b19-88d8-5593-ad9b-a6c620022a91"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("4770.00")
},
{
  ProductID: UUID("d37e1ce4-6ae2-5d76-85ad-67959bcf03a1"),
  OrderID: UUID("9eae0b19-88d8-5593-ad9b-a6c620022a91"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("2610.00")
},
{
  ProductID: UUID("d0daaeb5-7169-5bf2-adfb-9ef7149a0fd7"),
  OrderID: UUID("489aaff9-3428-545d-aef4-ff5035b36abe"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("1150.00")
},
{
  ProductID: UUID("1296c8f3-4c34-58bd-8fa5-58e65c09dc6b"),
  OrderID: UUID("45f964d1-74f7-55d7-938b-9cfe7b30324f"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("8970.00")
},
{
  ProductID: UUID("26ac85a1-197a-5273-80d6-c7a0f829b34d"),
  OrderID: UUID("783aa2b0-c7df-5954-8816-72572b155488"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("430.00")
},
{
  ProductID: UUID("3377495b-f6e6-5b19-aacd-dd4ddce972b4"),
  OrderID: UUID("52e85847-a270-5931-8b54-7d1e7dd1df93"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("1750.00")
},
{
  ProductID: UUID("6f81d746-9038-5d87-b0ab-1c40cac51de0"),
  OrderID: UUID("9e2ddb34-3246-57c9-8f2a-b7a8501d2460"),
  OrderDetailQuantity: 5,
  OrderDetailAmount: NumberDecimal("1950.00")
},
{
  ProductID: UUID("49837b1c-aeac-5661-8d07-a97adc41d851"),
  OrderID: UUID("9e2ddb34-3246-57c9-8f2a-b7a8501d2460"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("4380.00")
},
{
  ProductID: UUID("49837b1c-aeac-5661-8d07-a97adc41d851"),
  OrderID: UUID("9ffeeade-bc9c-5dad-b9dd-36a64f7ba470"),
  OrderDetailQuantity: 3,
  OrderDetailAmount: NumberDecimal("6570.00")
},
{
  ProductID: UUID("241ce5fb-54ae-554f-b6f7-6edfa6a4290e"),
  OrderID: UUID("be68bdc0-8832-5e2e-b650-0cda1e0a7c35"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("28900.00")
},
{
  ProductID: UUID("982ce262-b2ce-5167-b85e-1d84783d4ebc"),
  OrderID: UUID("be68bdc0-8832-5e2e-b650-0cda1e0a7c35"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("3980.00")
},
{
  ProductID: UUID("c2d3ccfe-6b55-519a-86e4-12b0d73f39f8"),
  OrderID: UUID("be68bdc0-8832-5e2e-b650-0cda1e0a7c35"),
  OrderDetailQuantity: 2,
  OrderDetailAmount: NumberDecimal("2380.00")
},
{
  ProductID: UUID("d2a0bcd3-2cac-5be6-a87d-db963ffa37c5"),
  OrderID: UUID("bc36e9f1-f417-5a0c-a7d4-8b271ee71146"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("890.00")
},
{
  ProductID: UUID("c6cf4140-6f94-5b69-a0df-9618b85d9b2e"),
  OrderID: UUID("894db47b-ded7-5a83-b269-8c3531cb9b0f"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("3190.00")
},
{
  ProductID: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  OrderID: UUID("2e883132-fb6e-5e5c-bad4-c31542f90acd"),
  OrderDetailQuantity: 1,
  OrderDetailAmount: NumberDecimal("680.00")
}
];
database.getCollection("order-details").insertMany(order_details);

const defectives = [
{
  _id: UUID("f0e575c9-3ba8-52d8-a7e8-7fa1c9ebf154"),
  ProductID: UUID("241ce5fb-54ae-554f-b6f7-6edfa6a4290e"),
  Quantity: 1,
  DateDeclared: ISODate("2026-03-03T11:17:00")
},
{
  _id: UUID("cd8550b1-5ae1-5cdf-ab60-c19f0d46ecb0"),
  ProductID: UUID("d2a0bcd3-2cac-5be6-a87d-db963ffa37c5"),
  Quantity: 2,
  DateDeclared: ISODate("2026-02-24T15:26:00")
},
{
  _id: UUID("0403acbc-ddcd-5e3e-929b-e150dcfee5bc"),
  ProductID: UUID("af8561cb-fd5f-5c69-84a8-d4fc7608ca2b"),
  Quantity: 1,
  DateDeclared: ISODate("2026-03-18T14:41:00")
},
{
  _id: UUID("f9ef8521-4f1b-5623-8c82-fdc5ac76116d"),
  ProductID: UUID("26ac85a1-197a-5273-80d6-c7a0f829b34d"),
  Quantity: 4,
  DateDeclared: ISODate("2026-04-02T10:34:00")
},
{
  _id: UUID("b5eac938-a2a1-52fd-b582-4637aaa9221b"),
  ProductID: UUID("913baf1a-6c07-5274-be04-63c1b9ddad02"),
  Quantity: 2,
  DateDeclared: ISODate("2026-04-07T16:29:00")
},
{
  _id: UUID("f7a85030-f5c4-5c83-af99-d140415ad9bd"),
  ProductID: UUID("888a2181-f7c0-5886-8f08-fea73f0c0b12"),
  Quantity: 1,
  DateDeclared: ISODate("2026-03-27T13:22:00")
},
{
  _id: UUID("97692a6c-dfd3-5101-a7f1-76357b7a2e42"),
  ProductID: UUID("d64b3134-3e6b-5699-aa1c-26cdb6281567"),
  Quantity: 1,
  DateDeclared: ISODate("2026-02-19T12:47:00")
},
{
  _id: UUID("fdb3b6b6-3e4f-515a-941a-f47f3c5ca78e"),
  ProductID: UUID("fc9744f3-b31a-51a4-a760-d3d049d8f8f1"),
  Quantity: 1,
  DateDeclared: ISODate("2026-04-10T11:13:00")
}
];
database.getCollection("defectives").insertMany(defectives);

const logs = [
{
  _id: UUID("138c3553-54b4-5f4f-a911-96a733e7cef0"),
  StaffID: UUID("4be43b93-b4cb-5c93-b1b6-434251fd7e7d"),
  LogCategory: "CATEGORIES",
  ActionType: "CREATE",
  LogDetails: "Созданы категории Орто и Уро",
  DateTime: ISODate("2026-02-10T10:11:00")
},
{
  _id: UUID("4d1f83b9-fe2b-5691-9851-42dbc0c912a5"),
  StaffID: UUID("4be43b93-b4cb-5c93-b1b6-434251fd7e7d"),
  LogCategory: "STAFFS",
  ActionType: "CREATE",
  LogDetails: "Добавлены роли и стартовый персонал",
  DateTime: ISODate("2026-02-10T10:26:00")
},
{
  _id: UUID("6de7263c-ab48-5317-a7f0-27bb39c25b4a"),
  StaffID: UUID("38841fb3-3d9e-530e-87ac-405843ba1e82"),
  LogCategory: "SUPPLIERS",
  ActionType: "CREATE",
  LogDetails: "Добавлен пул поставщиков по направлениям Орто и Уро",
  DateTime: ISODate("2026-02-10T10:37:00")
},
{
  _id: UUID("824c4be4-f212-5e8c-8b68-89fa6f6ef34e"),
  StaffID: UUID("38841fb3-3d9e-530e-87ac-405843ba1e82"),
  LogCategory: "PRODUCTS",
  ActionType: "CREATE",
  LogDetails: "Первичное заполнение справочника товаров",
  DateTime: ISODate("2026-02-10T11:17:00")
},
{
  _id: UUID("957838a6-84cd-51c1-b687-c3ca40e63912"),
  StaffID: UUID("38841fb3-3d9e-530e-87ac-405843ba1e82"),
  LogCategory: "STORAGES",
  ActionType: "ADD_STOCK",
  LogDetails: "Разнесены остатки по магазинам и складу",
  DateTime: ISODate("2026-02-10T11:41:00")
},
{
  _id: UUID("90d52b5e-3266-5929-bf27-3e00d96662a5"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ dd69d17a-304c-55eb-96b9-657919e4d42b со статусом Delivered",
  DateTime: ISODate("2026-02-10T11:41:00")
},
{
  _id: UUID("3291c128-d44c-5f19-94db-e74775c16dd5"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 085f2e11-08b0-5e5e-810d-b2f97ce90d7d со статусом Delivered",
  DateTime: ISODate("2026-02-10T10:37:00")
},
{
  _id: UUID("3aa15637-7783-5b8f-aaac-431af1b714d8"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ cb85e1e0-e85e-5c28-b74c-0b69e2fcc21e со статусом Delivered",
  DateTime: ISODate("2026-02-12T10:52:00")
},
{
  _id: UUID("664b2022-60a0-5fe5-ae38-6ebd0121a619"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ d4e616da-1a08-5ca7-b1a4-51cfac7b6b32 со статусом Delivered",
  DateTime: ISODate("2026-02-13T15:41:00")
},
{
  _id: UUID("480d5c85-855a-5343-a6a4-9a07814fe2c2"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ e3fa598a-133a-5a4b-9719-fc769bd72aec со статусом Delivered",
  DateTime: ISODate("2026-02-16T11:37:00")
},
{
  _id: UUID("ffcf8b2d-80fe-5404-951c-a0e950633548"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ f59eb226-dd08-5c29-a1d4-e3d4bbcbd024 со статусом Delivered",
  DateTime: ISODate("2026-02-16T10:44:00")
},
{
  _id: UUID("290e37de-9b74-54fb-ad83-9e19df0615d5"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 8abe3c9f-6349-5319-a920-5dd7befdd5ff со статусом Delivered",
  DateTime: ISODate("2026-02-17T17:44:00")
},
{
  _id: UUID("4477cd93-5d11-5080-bc29-05496b594105"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 9ae638b5-4144-55c9-9398-ec8884ca183f со статусом Delivered",
  DateTime: ISODate("2026-02-23T16:22:00")
},
{
  _id: UUID("22f76fe1-c7bb-5e44-af22-64f83925b641"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 6d3e031a-dd8c-5b09-ac74-ebdfa7ed22d2 со статусом Delivered",
  DateTime: ISODate("2026-02-24T15:17:00")
},
{
  _id: UUID("ca8f011f-8c66-574e-8e3b-63ba70adb4c2"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 514eb9fa-62e4-5653-bd8f-52b6d7b27b8b со статусом Delivered",
  DateTime: ISODate("2026-02-25T16:41:00")
},
{
  _id: UUID("2a4b14b4-82c6-50b2-96c9-a8ec6b6c8d17"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 78c1978a-0877-5383-95ef-4bdc7d5a7c58 со статусом Delivered",
  DateTime: ISODate("2026-02-25T10:56:00")
},
{
  _id: UUID("b031b993-b213-5e67-8cc8-e0dd3ebaf751"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ ad0959a7-9a24-528f-90df-cb6aaa31f205 со статусом Delivered",
  DateTime: ISODate("2026-02-26T17:37:00")
},
{
  _id: UUID("e3bcca0e-cd0c-5286-8058-da5c8acfa921"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ c17d7386-9d94-5545-9609-a9d10fd99d70 со статусом Delivered",
  DateTime: ISODate("2026-02-27T14:52:00")
},
{
  _id: UUID("ea1aeec3-137c-585b-b612-5fe15a4331fb"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 0044cde7-12b4-50d8-a01c-18d85712ff01 со статусом Delivered",
  DateTime: ISODate("2026-03-04T14:56:00")
},
{
  _id: UUID("7e0975b6-a973-5e29-b3db-067e43ef406c"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 7a1e5c56-a69e-5984-a208-1ae0cf31c918 со статусом Delivered",
  DateTime: ISODate("2026-03-06T11:26:00")
},
{
  _id: UUID("2107ae79-5023-5412-86e8-c73cdc93e274"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ a900ab77-c454-5ac7-9a4f-6b14cbdaf6db со статусом Delivered",
  DateTime: ISODate("2026-03-09T12:22:00")
},
{
  _id: UUID("af716295-a79f-5709-9c50-0b97e3ab3ca7"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 6b820c4c-54ef-5e30-b810-aef3ce84092f со статусом Delivered",
  DateTime: ISODate("2026-03-10T11:17:00")
},
{
  _id: UUID("415d2eb2-9660-510b-be62-1e1a4d11260d"),
  StaffID: UUID("5fb020d5-fd99-5f34-80cd-e62430420486"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ b612091f-6703-5518-8a78-da6e932b72c1 со статусом Delivered",
  DateTime: ISODate("2026-03-11T10:11:00")
},
{
  _id: UUID("bf2dc4aa-34bf-525e-af1d-7c3e9fa1f92f"),
  StaffID: UUID("627cf963-adef-5bc7-8abf-dddd621767e4"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ 5f1227a4-0ead-5c1c-95f3-d3306123c044 со статусом Delivered",
  DateTime: ISODate("2026-03-12T12:47:00")
},
{
  _id: UUID("2dffeb08-3f08-5c6c-8e0f-c7569eee0701"),
  StaffID: UUID("c9e58eda-2e44-5446-97c5-e3b8f85b8e66"),
  LogCategory: "ORDERS",
  ActionType: "CREATE",
  LogDetails: "Создан заказ deaad6fb-e671-54f8-88ef-e93787a866b5 со статусом Delivered",
  DateTime: ISODate("2026-03-13T10:44:00")
}
];
database.getCollection("logs").insertMany(logs);

const messages = [

];
if (messages.length) database.getCollection("messages").insertMany(messages);

print("Готово.");
print("Категории: 2");
print("Поставщики: 10");
print("Товары: 39 (Орто: 21, Уро: 18)");
print("Покупатели: 24");
print("Заказы: 52");
print("Строки заказов: 83");
print("Локации остатков: 105");
print("Брак: 8");
print("Логи: 25");
