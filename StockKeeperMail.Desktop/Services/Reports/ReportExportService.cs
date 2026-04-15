using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.DAL;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security;
using System.Text;
using System.Windows;
using System.Windows.Documents;
using System.Windows.Media;

namespace StockKeeperMail.Desktop.Services.Reports
{
    /// <summary>
    /// Сервис формирования табличного и печатного представления отчетов.
    /// </summary>
    public static class ReportExportService
    {
        public static List<ReportSheetData> BuildSheets(IEnumerable<ReportSectionKey> selectedSections, UnitOfWork unitOfWork)
        {
            List<ReportSectionKey> keys = selectedSections.Distinct().ToList();
            List<ReportSheetData> sheets = new List<ReportSheetData>();

            List<Order> orders = keys.Contains(ReportSectionKey.Invoices) || keys.Contains(ReportSectionKey.Orders)
                ? unitOfWork.OrderRepository.Get().OrderByDescending(o => o.OrderDate).ToList()
                : new List<Order>();
            List<Customer> customers = keys.Contains(ReportSectionKey.Customers)
                ? unitOfWork.CustomerRepository.Get().OrderBy(c => c.CustomerLastname).ThenBy(c => c.CustomerFirstname).ToList()
                : new List<Customer>();
            List<Product> products = keys.Contains(ReportSectionKey.Products) || keys.Contains(ReportSectionKey.Defectives) || keys.Contains(ReportSectionKey.Categories) || keys.Contains(ReportSectionKey.Suppliers) || keys.Contains(ReportSectionKey.Locations)
                ? unitOfWork.ProductRepository.Get().OrderBy(p => p.ProductName).ToList()
                : new List<Product>();
            List<Warehouse> warehouses = keys.Contains(ReportSectionKey.Warehouses)
                ? unitOfWork.WarehouseRepository.Get().OrderBy(w => w.WarehouseName).ToList()
                : new List<Warehouse>();
            List<Defective> defectives = keys.Contains(ReportSectionKey.Defectives)
                ? unitOfWork.DefectiveRepository.Get().OrderByDescending(d => d.DateDeclared).ToList()
                : new List<Defective>();
            List<Category> categories = keys.Contains(ReportSectionKey.Categories)
                ? unitOfWork.CategoryRepository.Get().OrderBy(c => c.CategoryName).ToList()
                : new List<Category>();
            List<Location> locations = keys.Contains(ReportSectionKey.Locations)
                ? unitOfWork.LocationRepository.Get().OrderBy(l => l.LocationName).ToList()
                : new List<Location>();
            List<Supplier> suppliers = keys.Contains(ReportSectionKey.Suppliers)
                ? unitOfWork.SupplierRepository.Get().OrderBy(s => s.SupplierName).ToList()
                : new List<Supplier>();
            List<Role> roles = keys.Contains(ReportSectionKey.Roles)
                ? unitOfWork.RoleRepository.Get().OrderBy(r => r.RoleName).ToList()
                : new List<Role>();
            List<Staff> staffs = keys.Contains(ReportSectionKey.Staffs) || keys.Contains(ReportSectionKey.Messages) || keys.Contains(ReportSectionKey.Customers)
                ? unitOfWork.StaffRepository.Get().OrderBy(s => s.StaffLastName).ThenBy(s => s.StaffFirstName).ToList()
                : new List<Staff>();
            List<InternalMessage> messages = keys.Contains(ReportSectionKey.Messages)
                ? unitOfWork.InternalMessageRepository.Get().OrderByDescending(m => m.SentAt).ToList()
                : new List<InternalMessage>();

            Dictionary<Guid, Staff> staffMap = staffs.Where(s => s != null).ToDictionary(s => s.StaffID, s => s);
            Dictionary<Guid, Product> productMap = products.Where(p => p != null).ToDictionary(p => p.ProductID, p => p);
            Dictionary<Guid, Category> categoryMap = categories.Where(c => c != null).ToDictionary(c => c.CategoryID, c => c);
            Dictionary<Guid, Supplier> supplierMap = suppliers.Where(s => s != null).ToDictionary(s => s.SupplierID, s => s);

            foreach (ReportSectionKey key in keys)
            {
                switch (key)
                {
                    case ReportSectionKey.Invoices:
                        sheets.Add(BuildInvoicesSheet(orders));
                        break;
                    case ReportSectionKey.Orders:
                        sheets.Add(BuildOrdersSheet(orders));
                        break;
                    case ReportSectionKey.Customers:
                        sheets.Add(BuildCustomersSheet(customers, staffMap));
                        break;
                    case ReportSectionKey.Products:
                        sheets.Add(BuildProductsSheet(products));
                        break;
                    case ReportSectionKey.Warehouses:
                        sheets.Add(BuildWarehousesSheet(warehouses));
                        break;
                    case ReportSectionKey.Defectives:
                        sheets.Add(BuildDefectivesSheet(defectives, productMap));
                        break;
                    case ReportSectionKey.Categories:
                        sheets.Add(BuildCategoriesSheet(categories, products));
                        break;
                    case ReportSectionKey.Locations:
                        sheets.Add(BuildLocationsSheet(locations));
                        break;
                    case ReportSectionKey.Suppliers:
                        sheets.Add(BuildSuppliersSheet(suppliers, products));
                        break;
                    case ReportSectionKey.Roles:
                        sheets.Add(BuildRolesSheet(roles));
                        break;
                    case ReportSectionKey.Staffs:
                        sheets.Add(BuildStaffsSheet(staffs));
                        break;
                    case ReportSectionKey.Messages:
                        sheets.Add(BuildMessagesSheet(messages, staffMap));
                        break;
                }
            }

            return sheets;
        }

        public static string BuildExcelXml(IEnumerable<ReportSheetData> sheets)
        {
            StringBuilder builder = new StringBuilder();
            builder.AppendLine("<?xml version=\"1.0\"?>");
            builder.AppendLine("<?mso-application progid=\"Excel.Sheet\"?>");
            builder.AppendLine("<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\" xmlns:html=\"http://www.w3.org/TR/REC-html40\">");
            builder.AppendLine("  <Styles>");
            builder.AppendLine("    <Style ss:ID=\"Default\" ss:Name=\"Normal\"><Alignment ss:Vertical=\"Top\" ss:WrapText=\"1\"/></Style>");
            builder.AppendLine("    <Style ss:ID=\"Header\"><Font ss:Bold=\"1\"/><Interior ss:Color=\"#DDE7FF\" ss:Pattern=\"Solid\"/></Style>");
            builder.AppendLine("  </Styles>");

            foreach (ReportSheetData sheet in sheets)
            {
                builder.AppendLine($"  <Worksheet ss:Name=\"{EscapeXml(SanitizeWorksheetName(sheet.SheetName))}\">");
                builder.AppendLine("    <Table>");
                builder.AppendLine("      <Row>");
                foreach (string column in sheet.Columns)
                {
                    builder.AppendLine($"        <Cell ss:StyleID=\"Header\"><Data ss:Type=\"String\">{EscapeXml(column)}</Data></Cell>");
                }
                builder.AppendLine("      </Row>");

                foreach (List<string> row in sheet.Rows)
                {
                    builder.AppendLine("      <Row>");
                    foreach (string cell in row)
                    {
                        builder.AppendLine($"        <Cell><Data ss:Type=\"String\">{EscapeXml(cell)}</Data></Cell>");
                    }
                    builder.AppendLine("      </Row>");
                }

                builder.AppendLine("    </Table>");
                builder.AppendLine("  </Worksheet>");
            }

            builder.AppendLine("</Workbook>");
            return builder.ToString();
        }

        public static FlowDocument BuildPrintableDocument(IEnumerable<ReportSheetData> sheets)
        {
            FlowDocument document = new FlowDocument
            {
                PagePadding = new Thickness(40),
                FontFamily = new FontFamily("Segoe UI"),
                FontSize = 12
            };

            Paragraph title = new Paragraph(new Run("Отчет по системе StockKeeperMail"))
            {
                FontSize = 18,
                FontWeight = FontWeights.Bold,
                Margin = new Thickness(0, 0, 0, 18)
            };
            document.Blocks.Add(title);

            foreach (ReportSheetData sheet in sheets)
            {
                document.Blocks.Add(new Paragraph(new Run(sheet.SheetName))
                {
                    FontSize = 15,
                    FontWeight = FontWeights.Bold,
                    Margin = new Thickness(0, 12, 0, 8)
                });

                document.Blocks.Add(new Paragraph(new Run(string.Join(" | ", sheet.Columns)))
                {
                    FontWeight = FontWeights.SemiBold,
                    Margin = new Thickness(0, 0, 0, 6)
                });

                if (sheet.Rows.Count == 0)
                {
                    document.Blocks.Add(new Paragraph(new Run("Нет данных для выбранного раздела."))
                    {
                        Margin = new Thickness(0, 0, 0, 8)
                    });
                    continue;
                }

                foreach (List<string> row in sheet.Rows)
                {
                    document.Blocks.Add(new Paragraph(new Run(string.Join(" | ", row)))
                    {
                        Margin = new Thickness(0, 0, 0, 4)
                    });
                }
            }

            return document;
        }

        private static ReportSheetData BuildInvoicesSheet(List<Order> orders)
        {
            ReportSheetData sheet = CreateSheet("Счета на оплату", "Номер счета", "Дата", "Клиент", "Товар", "Количество", "Сумма позиции", "Итого к оплате", "Статус доставки");

            foreach (Order order in orders)
            {
                string customerName = GetCustomerName(order.Customer);
                if (order.OrderDetails != null && order.OrderDetails.Count > 0)
                {
                    foreach (OrderDetail detail in order.OrderDetails)
                    {
                        sheet.Rows.Add(new List<string>
                        {
                            order.OrderID.ToString(),
                            FormatDate(order.OrderDate),
                            customerName,
                            detail.Product?.ProductName ?? string.Empty,
                            detail.OrderDetailQuantity.ToString(CultureInfo.InvariantCulture),
                            FormatDecimal(detail.OrderDetailAmount),
                            FormatDecimal(order.OrderTotal),
                            order.DeliveryStatus ?? string.Empty
                        });
                    }
                }
                else
                {
                    sheet.Rows.Add(new List<string>
                    {
                        order.OrderID.ToString(),
                        FormatDate(order.OrderDate),
                        customerName,
                        string.Empty,
                        "0",
                        "0",
                        FormatDecimal(order.OrderTotal),
                        order.DeliveryStatus ?? string.Empty
                    });
                }
            }

            return sheet;
        }

        private static ReportSheetData BuildOrdersSheet(List<Order> orders)
        {
            ReportSheetData sheet = CreateSheet("Заказы", "Номер заказа", "Дата", "Клиент", "Статус доставки", "Сумма", "Количество позиций");

            foreach (Order order in orders)
            {
                sheet.Rows.Add(new List<string>
                {
                    order.OrderID.ToString(),
                    FormatDate(order.OrderDate),
                    GetCustomerName(order.Customer),
                    order.DeliveryStatus ?? string.Empty,
                    FormatDecimal(order.OrderTotal),
                    (order.OrderDetails?.Count ?? 0).ToString(CultureInfo.InvariantCulture)
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildCustomersSheet(List<Customer> customers, Dictionary<Guid, Staff> staffMap)
        {
            ReportSheetData sheet = CreateSheet("Клиенты", "ФИО", "Телефон", "Email", "Адрес", "Ответственный сотрудник", "ID клиента");

            foreach (Customer customer in customers)
            {
                staffMap.TryGetValue(customer.StaffID, out Staff staff);
                sheet.Rows.Add(new List<string>
                {
                    GetCustomerName(customer),
                    customer.CustomerPhone ?? string.Empty,
                    customer.CustomerEmail ?? string.Empty,
                    customer.CustomerAddress ?? string.Empty,
                    GetStaffName(staff),
                    customer.CustomerID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildProductsSheet(List<Product> products)
        {
            ReportSheetData sheet = CreateSheet("Товары", "Наименование", "Артикул", "Ед. изм.", "Цена", "Количество", "Статус", "Категория", "Поставщик", "ID товара");

            foreach (Product product in products)
            {
                sheet.Rows.Add(new List<string>
                {
                    product.ProductName ?? string.Empty,
                    product.ProductSKU ?? string.Empty,
                    product.ProductUnit ?? string.Empty,
                    FormatDecimal(product.ProductPrice),
                    product.ProductQuantity.ToString(CultureInfo.InvariantCulture),
                    product.ProductAvailability ?? string.Empty,
                    product.Category?.CategoryName ?? string.Empty,
                    product.Supplier?.SupplierName ?? string.Empty,
                    product.ProductID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildWarehousesSheet(List<Warehouse> warehouses)
        {
            ReportSheetData sheet = CreateSheet("Склады", "Название", "Адрес", "Телефон", "Email", "НДС", "ID склада");

            foreach (Warehouse warehouse in warehouses)
            {
                sheet.Rows.Add(new List<string>
                {
                    warehouse.WarehouseName ?? string.Empty,
                    warehouse.WarehouseAddress ?? string.Empty,
                    warehouse.WarehousePhone ?? string.Empty,
                    warehouse.WarehouseEmail ?? string.Empty,
                    FormatDecimal(warehouse.WarehouseVat),
                    warehouse.WarehouseID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildDefectivesSheet(List<Defective> defectives, Dictionary<Guid, Product> productMap)
        {
            ReportSheetData sheet = CreateSheet("Брак", "Товар", "Артикул", "Количество", "Дата фиксации", "Категория", "Поставщик", "ID записи");

            foreach (Defective defective in defectives)
            {
                Product product = defective.Product;
                if (product == null)
                {
                    productMap.TryGetValue(defective.ProductID, out product);
                }

                sheet.Rows.Add(new List<string>
                {
                    product?.ProductName ?? string.Empty,
                    product?.ProductSKU ?? string.Empty,
                    defective.Quantity.ToString(CultureInfo.InvariantCulture),
                    FormatDate(defective.DateDeclared),
                    product?.Category?.CategoryName ?? string.Empty,
                    product?.Supplier?.SupplierName ?? string.Empty,
                    defective.DefectiveID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildCategoriesSheet(List<Category> categories, List<Product> products)
        {
            ReportSheetData sheet = CreateSheet("Категории", "Название", "Статус", "Описание", "Количество товаров", "ID категории");

            foreach (Category category in categories)
            {
                int productsCount = products.Count(p => p.CategoryID == category.CategoryID);
                sheet.Rows.Add(new List<string>
                {
                    category.CategoryName ?? string.Empty,
                    category.CategoryStatus ?? string.Empty,
                    category.CategoryDescription ?? string.Empty,
                    productsCount.ToString(CultureInfo.InvariantCulture),
                    category.CategoryID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildLocationsSheet(List<Location> locations)
        {
            ReportSheetData sheet = CreateSheet("Склады и магазины", "Название", "Количество товарных позиций", "Общее количество товара", "ID локации");

            foreach (Location location in locations)
            {
                int positions = location.ProductLocations?.Count ?? 0;
                int totalQuantity = location.ProductLocations?.Sum(pl => pl.ProductQuantity) ?? 0;

                sheet.Rows.Add(new List<string>
                {
                    location.LocationName ?? string.Empty,
                    positions.ToString(CultureInfo.InvariantCulture),
                    totalQuantity.ToString(CultureInfo.InvariantCulture),
                    location.LocationID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildSuppliersSheet(List<Supplier> suppliers, List<Product> products)
        {
            ReportSheetData sheet = CreateSheet("Поставщики", "Название", "Телефон", "Email", "Адрес", "Статус", "Количество товаров", "ID поставщика");

            foreach (Supplier supplier in suppliers)
            {
                int productsCount = products.Count(p => p.SupplierID == supplier.SupplierID);
                sheet.Rows.Add(new List<string>
                {
                    supplier.SupplierName ?? string.Empty,
                    supplier.SupplierPhone ?? string.Empty,
                    supplier.SupplierEmail ?? string.Empty,
                    supplier.SupplierAddress ?? string.Empty,
                    supplier.SupplierStatus ?? string.Empty,
                    productsCount.ToString(CultureInfo.InvariantCulture),
                    supplier.SupplierID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildRolesSheet(List<Role> roles)
        {
            ReportSheetData sheet = CreateSheet("Роли", "Название", "Статус", "Описание", "Заказы", "Клиенты", "Товары", "Складской учет", "Брак", "Категории", "Локации", "Поставщики", "Роли", "Сотрудники", "Журнал активности", "ID роли");

            foreach (Role role in roles)
            {
                sheet.Rows.Add(new List<string>
                {
                    role.RoleName ?? string.Empty,
                    role.RoleStatus ?? string.Empty,
                    role.RoleDescription ?? string.Empty,
                    FormatPermissionGroup(role.OrdersView, role.OrdersAdd, role.OrdersEdit, role.OrdersDelete),
                    FormatPermissionGroup(role.CustomersView, role.CustomersAdd, role.CustomersEdit, role.CustomersDelete),
                    FormatPermissionGroup(role.ProductsView, role.ProductsAdd, role.ProductsEdit, role.ProductsDelete),
                    FormatPermissionGroup(role.StoragesView, role.StoragesAdd, role.StoragesEdit, role.StoragesDelete),
                    FormatPermissionGroup(role.DefectivesView, role.DefectivesAdd, role.DefectivesEdit, role.DefectivesDelete),
                    FormatPermissionGroup(role.CategoriesView, role.CategoriesAdd, role.CategoriesEdit, role.CategoriesDelete),
                    FormatPermissionGroup(role.LocationsView, role.LocationsAdd, role.LocationsEdit, role.LocationsDelete),
                    FormatPermissionGroup(role.SuppliersView, role.SuppliersAdd, role.SuppliersEdit, role.SuppliersDelete),
                    FormatPermissionGroup(role.RolesView, role.RolesAdd, role.RolesEdit, role.RolesDelete),
                    FormatPermissionGroup(role.StaffsView, role.StaffsAdd, role.StaffsEdit, role.StaffsDelete),
                    FormatPermissionGroup(role.LogsView, role.LogsAdd, role.LogsEdit, role.LogsDelete),
                    role.RoleID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildStaffsSheet(List<Staff> staffs)
        {
            ReportSheetData sheet = CreateSheet("Сотрудники", "ФИО", "Логин", "Пароль", "Роль", "Email", "Телефон", "Адрес", "ID сотрудника");

            foreach (Staff staff in staffs)
            {
                sheet.Rows.Add(new List<string>
                {
                    GetStaffName(staff),
                    staff.StaffUsername ?? string.Empty,
                    staff.StaffPassword ?? string.Empty,
                    staff.Role?.RoleName ?? string.Empty,
                    staff.StaffEmail ?? string.Empty,
                    staff.StaffPhone ?? string.Empty,
                    staff.StaffAddress ?? string.Empty,
                    staff.StaffID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData BuildMessagesSheet(List<InternalMessage> messages, Dictionary<Guid, Staff> staffMap)
        {
            ReportSheetData sheet = CreateSheet("Сообщения", "Дата отправки", "Отправитель", "Получатель", "Тема", "Текст", "Прочитано", "ID сообщения");

            foreach (InternalMessage message in messages)
            {
                Staff sender = message.SenderStaff;
                Staff recipient = message.RecipientStaff;

                if (sender == null)
                {
                    staffMap.TryGetValue(message.SenderStaffID, out sender);
                }

                if (recipient == null)
                {
                    staffMap.TryGetValue(message.RecipientStaffID, out recipient);
                }

                sheet.Rows.Add(new List<string>
                {
                    FormatDate(message.SentAt),
                    GetStaffName(sender),
                    GetStaffName(recipient),
                    message.Subject ?? string.Empty,
                    message.Body ?? string.Empty,
                    message.IsRead ? "Да" : "Нет",
                    message.InternalMessageID.ToString()
                });
            }

            return sheet;
        }

        private static ReportSheetData CreateSheet(string name, params string[] columns)
        {
            return new ReportSheetData
            {
                SheetName = name,
                Columns = columns.ToList()
            };
        }

        private static string GetCustomerName(Customer customer)
        {
            if (customer == null)
            {
                return string.Empty;
            }

            return $"{customer.CustomerFirstname} {customer.CustomerLastname}".Trim();
        }

        private static string GetStaffName(Staff staff)
        {
            if (staff == null)
            {
                return string.Empty;
            }

            return $"{staff.StaffFirstName} {staff.StaffLastName}".Trim();
        }

        private static string FormatPermissionGroup(bool view, bool add, bool edit, bool delete)
        {
            List<string> permissions = new List<string>();
            if (view) permissions.Add("просмотр");
            if (add) permissions.Add("добавление");
            if (edit) permissions.Add("изменение");
            if (delete) permissions.Add("удаление");
            return permissions.Count == 0 ? "нет доступа" : string.Join(", ", permissions);
        }

        private static string FormatDate(DateTime value)
        {
            return value == default ? string.Empty : value.ToString("dd.MM.yyyy HH:mm", CultureInfo.InvariantCulture);
        }

        private static string FormatDecimal(decimal value)
        {
            return value.ToString("0.##", CultureInfo.InvariantCulture);
        }

        private static string SanitizeWorksheetName(string sheetName)
        {
            string result = sheetName;
            foreach (char invalid in new[] { '\\', '/', '?', '*', '[', ']', ':' })
            {
                result = result.Replace(invalid, ' ');
            }

            if (string.IsNullOrWhiteSpace(result))
            {
                result = "Лист";
            }

            return result.Length > 31 ? result.Substring(0, 31) : result;
        }

        private static string EscapeXml(string value)
        {
            return SecurityElement.Escape(value ?? string.Empty) ?? string.Empty;
        }
    }
}
