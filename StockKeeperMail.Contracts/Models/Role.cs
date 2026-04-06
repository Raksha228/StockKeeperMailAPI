using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Database.Models
{
    /// <summary>
    /// Представляет роль сотрудника и набор разрешений на действия в системе.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Role
    {
        /// <summary>
        /// Уникальный идентификатор роли.
        /// </summary>
        [Key]
        [BsonId]
        public Guid RoleID { get; set; }

        /// <summary>
        /// Наименование роли.
        /// </summary>
        public string RoleName { get; set; }
        /// <summary>
        /// Текущий статус роли.
        /// </summary>
        public string RoleStatus { get; set; }
        /// <summary>
        /// Описание роли.
        /// </summary>
        public string RoleDescription { get; set; }

        /// <summary>
        /// Разрешение на просмотр заказов.
        /// </summary>
        public bool OrdersView { get; set; }
        /// <summary>
        /// Разрешение на добавление заказов.
        /// </summary>
        public bool OrdersAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование заказов.
        /// </summary>
        public bool OrdersEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление заказов.
        /// </summary>
        public bool OrdersDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр клиентов.
        /// </summary>
        public bool CustomersView { get; set; }
        /// <summary>
        /// Разрешение на добавление клиентов.
        /// </summary>
        public bool CustomersAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование клиентов.
        /// </summary>
        public bool CustomersEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление клиентов.
        /// </summary>
        public bool CustomersDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр товаров.
        /// </summary>
        public bool ProductsView { get; set; }
        /// <summary>
        /// Разрешение на добавление товаров.
        /// </summary>
        public bool ProductsAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование товаров.
        /// </summary>
        public bool ProductsEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление товаров.
        /// </summary>
        public bool ProductsDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр складских данных.
        /// </summary>
        public bool StoragesView { get; set; }
        /// <summary>
        /// Разрешение на добавление складских данных.
        /// </summary>
        public bool StoragesAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование складских данных.
        /// </summary>
        public bool StoragesEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление складских данных.
        /// </summary>
        public bool StoragesDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр брака.
        /// </summary>
        public bool DefectivesView { get; set; }
        /// <summary>
        /// Разрешение на добавление брака.
        /// </summary>
        public bool DefectivesAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование брака.
        /// </summary>
        public bool DefectivesEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление брака.
        /// </summary>
        public bool DefectivesDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр категорий.
        /// </summary>
        public bool CategoriesView { get; set; }
        /// <summary>
        /// Разрешение на добавление категорий.
        /// </summary>
        public bool CategoriesAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование категорий.
        /// </summary>
        public bool CategoriesEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление категорий.
        /// </summary>
        public bool CategoriesDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр локаций.
        /// </summary>
        public bool LocationsView { get; set; }
        /// <summary>
        /// Разрешение на добавление локаций.
        /// </summary>
        public bool LocationsAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование локаций.
        /// </summary>
        public bool LocationsEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление локаций.
        /// </summary>
        public bool LocationsDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр поставщиков.
        /// </summary>
        public bool SuppliersView { get; set; }
        /// <summary>
        /// Разрешение на добавление поставщиков.
        /// </summary>
        public bool SuppliersAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование поставщиков.
        /// </summary>
        public bool SuppliersEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление поставщиков.
        /// </summary>
        public bool SuppliersDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр ролей.
        /// </summary>
        public bool RolesView { get; set; }
        /// <summary>
        /// Разрешение на добавление ролей.
        /// </summary>
        public bool RolesAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование ролей.
        /// </summary>
        public bool RolesEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление ролей.
        /// </summary>
        public bool RolesDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр сотрудников.
        /// </summary>
        public bool StaffsView { get; set; }
        /// <summary>
        /// Разрешение на добавление сотрудников.
        /// </summary>
        public bool StaffsAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование сотрудников.
        /// </summary>
        public bool StaffsEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление сотрудников.
        /// </summary>
        public bool StaffsDelete { get; set; }

        /// <summary>
        /// Разрешение на просмотр журналов.
        /// </summary>
        public bool LogsView { get; set; }
        /// <summary>
        /// Разрешение на добавление журналов.
        /// </summary>
        public bool LogsAdd { get; set; }
        /// <summary>
        /// Разрешение на редактирование журналов.
        /// </summary>
        public bool LogsEdit { get; set; }
        /// <summary>
        /// Разрешение на удаление журналов.
        /// </summary>
        public bool LogsDelete { get; set; }

        /// <summary>
        /// Связанная коллекция сотрудников с данной ролью.
        /// </summary>
        [BsonIgnore]
        public ICollection<Staff> Staffs { get; set; }
    }
}
