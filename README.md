<div align="center">

# StockKeeperMail

Настольное корпоративное приложение для управления складскими остатками, товарами, заказами, ролями пользователей и внутренней электронной почтой для ИП Бахолдина О. Н.

Текущая версия проекта переведена на клиент-серверную архитектуру:

**WPF Desktop -> ASP.NET Core Web API -> MongoDB**

</div>

---

## О проекте

**StockKeeperMail** — это информационная система для инвентаризации складских запасов и автоматизации внутренних бизнес-процессов. Приложение позволяет вести учёт товаров, сотрудников, ролей, заказов, поставщиков, локаций хранения, брака и внутренней переписки.

В текущей реализации WPF-клиент больше не работает с базой данных напрямую. Все операции выполняются через REST API, а данные хранятся в MongoDB.

## Архитектура

```text
WPF Desktop (StockKeeperMail.Desktop)
        |
        | HTTP / JSON
        v
ASP.NET Core Web API (StockKeeperMail.Api)
        |
        | MongoDB.Driver
        v
MongoDB (StockKeeperMailDb)
```

### Что изменено

- прямое подключение Desktop-клиента к SQL Server убрано
- доступ к данным вынесен в `StockKeeperMail.Api`
- общие модели вынесены в `StockKeeperMail.Contracts`
- WPF-клиент работает через `HttpClient`
- MongoDB используется как основная база данных

## Структура решения

```text
StockKeeperMail_API_Mongo_fixed/
├── StockKeeperMail.Api/          # ASP.NET Core Web API
├── StockKeeperMail.Contracts/    # Общие модели для API и Desktop
├── StockKeeperMail.Desktop/      # WPF-клиент
├── StockKeeperMail.Database/     # Старый SQL-проект, оставлен как историческая часть
├── images/                       # Скриншоты интерфейса
├── API_MIGRATION_NOTES.md
├── MONGODB_SETUP.md
└── README.md
```

> [!IMPORTANT]
> Для запуска текущей версии нужны только `StockKeeperMail.Api`, `StockKeeperMail.Contracts` и `StockKeeperMail.Desktop`
>
> `StockKeeperMail.Database` больше не участвует в рабочем запуске приложения и оставлен только как часть исходного дипломного проекта

## Основные возможности

- вход в систему по логину и паролю
- управление ролями и правами доступа
- управление сотрудниками
- управление товарами, категориями, поставщиками и складами
- учёт размещения товаров по локациям хранения
- управление заказами и деталями заказов
- учёт брака
- внутренняя электронная почта
- просмотр журналов действий и базовая аналитика

## Технологии

### Клиентская часть
- C#
- WPF
- XAML
- MVVM
- CommunityToolkit.Mvvm
- MaterialDesignThemes
- LiveCharts.Wpf.Core

### Серверная часть
- ASP.NET Core Web API
- REST API
- `HttpClient`

### Хранение данных
- MongoDB
- MongoDB.Driver

### Целевая платформа
- .NET 10
- Windows для WPF-клиента

## Требования

Для запуска проекта нужны:

- Visual Studio 2022 или новее
- .NET 10 SDK
- MongoDB Community Server
- MongoDB Compass, опционально, для просмотра данных

## Конфигурация

### 1. Настройка API

Файл: `StockKeeperMail.Api/appsettings.json`

```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "StockKeeperMailDb"
  },
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5194"
      }
    }
  }
}
```

### 2. Настройка Desktop-клиента

Файл: `StockKeeperMail.Desktop/apiconfig.json`

```json
{
  "Api": {
    "BaseUrl": "http://localhost:5194"
  }
}
```

> [!NOTE]
> Адрес в `apiconfig.json` должен совпадать с адресом API из `appsettings.json`

## Как запускать проект

### Вариант 1. Через Visual Studio

1. Открой решение
2. Установи `StockKeeperMail.Api` и `StockKeeperMail.Desktop` как несколько стартовых проектов
3. Сначала должен стартовать API
4. Затем запускается Desktop-клиент

### Вариант 2. Через терминал

#### Шаг 1. Запусти MongoDB

Убедись, что локальный сервер MongoDB работает на `mongodb://localhost:27017`

#### Шаг 2. Запусти API

```powershell
cd StockKeeperMail.Api
dotnet restore
dotnet run
```

Ожидаемый результат:

```text
Now listening on: http://localhost:5194
```

#### Шаг 3. Запусти Desktop-клиент

В новом окне терминала:

```powershell
cd StockKeeperMail.Desktop
dotnet restore
dotnet run
```

## Первый запуск

### Важно

В проекте **нет автоматического seed-заполнения базы** и **нет автоматического переноса старых SQL-данных в MongoDB**.

Это значит, что после первого запуска MongoDB может быть пустой. Для работы входа в систему нужно вручную добавить хотя бы:

- одну роль
- одного сотрудника

Без этого авторизация не сработает

## База данных MongoDB

Используется база данных:

```text
StockKeeperMailDb
```

Основные коллекции:

- `roles`
- `staff`
- `categories`
- `warehouses`
- `suppliers`
- `products`
- `locations`
- `product-locations`
- `customers`
- `orders`
- `order-details`
- `defectives`
- `logs`
- `messages`

> [!TIP]
> MongoDB может не показывать базу и коллекции, пока в них не появится первая запись. Это нормальное поведение

## Добавление роли и сотрудника

Самый правильный способ — добавить стартовые данные **через API**, а не импортом обычного JSON напрямую в Compass. Тогда GUID-поля будут корректно обработаны приложением.

### 1. Добавление роли

```powershell
Invoke-RestMethod \
  -Method Post \
  -Uri "http://localhost:5194/api/roles" \
  -ContentType "application/json" \
  -Body @'
{
  "RoleID": "11111111-1111-1111-1111-111111111111",
  "RoleName": "Administrator",
  "RoleStatus": "Active",
  "RoleDescription": "System administrator",
  "OrdersView": true,
  "OrdersAdd": true,
  "OrdersEdit": true,
  "OrdersDelete": true,
  "CustomersView": true,
  "CustomersAdd": true,
  "CustomersEdit": true,
  "CustomersDelete": true,
  "ProductsView": true,
  "ProductsAdd": true,
  "ProductsEdit": true,
  "ProductsDelete": true,
  "StoragesView": true,
  "StoragesAdd": true,
  "StoragesEdit": true,
  "StoragesDelete": true,
  "DefectivesView": true,
  "DefectivesAdd": true,
  "DefectivesEdit": true,
  "DefectivesDelete": true,
  "CategoriesView": true,
  "CategoriesAdd": true,
  "CategoriesEdit": true,
  "CategoriesDelete": true,
  "LocationsView": true,
  "LocationsAdd": true,
  "LocationsEdit": true,
  "LocationsDelete": true,
  "SuppliersView": true,
  "SuppliersAdd": true,
  "SuppliersEdit": true,
  "SuppliersDelete": true,
  "RolesView": true,
  "RolesAdd": true,
  "RolesEdit": true,
  "RolesDelete": true,
  "StaffsView": true,
  "StaffsAdd": true,
  "StaffsEdit": true,
  "StaffsDelete": true,
  "LogsView": true,
  "LogsAdd": true,
  "LogsEdit": true,
  "LogsDelete": true
}
'@
```

### 2. Добавление сотрудника

```powershell
Invoke-RestMethod \
  -Method Post \
  -Uri "http://localhost:5194/api/staff" \
  -ContentType "application/json" \
  -Body @'
{
  "StaffID": "22222222-2222-2222-2222-222222222222",
  "RoleID": "11111111-1111-1111-1111-111111111111",
  "StaffFirstName": "Admin",
  "StaffLastName": "User",
  "StaffAddress": "Office",
  "StaffPhone": "+70000000000",
  "StaffEmail": "admin@local.test",
  "StaffUsername": "admin",
  "StaffPassword": "admin123"
}
'@
```

### 3. Проверка, что данные созданы

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5194/api/roles"
Invoke-RestMethod -Method Get -Uri "http://localhost:5194/api/staff"
```

### 4. Данные для входа

```text
Логин: admin
Пароль: admin123
```

## Проверка работоспособности API

Для быстрой проверки доступности API можно открыть:

```text
http://localhost:5194/api/health
```

Если API работает корректно, endpoint должен вернуть успешный ответ

## Частые проблемы

### 1. Desktop запускается, но не может войти в систему

Проверь:

- запущен ли `StockKeeperMail.Api`
- существует ли роль в коллекции `roles`
- существует ли сотрудник в коллекции `staff`
- совпадает ли `RoleID` сотрудника с `RoleID` роли

### 2. В MongoDB не видно базы данных

Это обычно значит, что в базу ещё не была выполнена ни одна успешная запись

### 3. Ошибка подключения клиента к API

Проверь совпадение адресов:

- `StockKeeperMail.Api/appsettings.json`
- `StockKeeperMail.Desktop/apiconfig.json`

### 4. Ошибка при F5 в Visual Studio

Проверь, что:

- `StockKeeperMail.Contracts` подключён как `ProjectReference`
- оба проекта пересобраны после изменений
- API стартует раньше WPF-клиента

## Скриншоты

### LoginView
![LoginView](images/LoginView.png)

### MainWindow
![MainWindow](images/MainWindow.png)

### CategoryListView
![CategoryListView](images/CategoryListView.png)

### RoleFormView
![RoleFormView](images/RoleFormView.png)

### PrintInvoiceView
![PrintInvoiceView](images/PrintInvoiceView.png)

## Примечание по старому SQL-проекту

В решении сохранён проект `StockKeeperMail.Database`, который относится к предыдущей версии приложения на EF Core и SQL Server. Он может использоваться как историческая часть дипломного проекта, но для текущего запуска не нужен

## Итог

Текущая версия StockKeeperMail представляет собой настольное корпоративное приложение с WPF-интерфейсом, отдельным API-слоем и MongoDB в качестве хранилища данных. Такой подход делает систему более гибкой, масштабируемой и ближе к реальной клиент-серверной архитектуре, чем исходный вариант с прямым доступом к базе данных из Desktop-клиента
