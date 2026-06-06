using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Desktop.ViewModels
{
    /// <summary>
    /// Представляет склад в интерфейсе выбора и списках.
    /// </summary>
    public class WarehouseViewModel : ViewModelBase
    {
        private readonly Warehouse _warehouse;
        public Warehouse Warehouse => _warehouse;

        public string WarehouseID => _warehouse.WarehouseID.ToString();
        public string WarehouseName => _warehouse.WarehouseName;
        public string WarehouseAddress => _warehouse.WarehouseAddress;
        public string WarehousePhone => _warehouse.WarehousePhone;
        public string WarehouseEmail => _warehouse.WarehouseEmail;
        public string WarehouseVat => _warehouse.WarehouseVat.ToString();

        public WarehouseViewModel(Warehouse warehouse)
        {
            _warehouse = warehouse;
        }
    }
}
