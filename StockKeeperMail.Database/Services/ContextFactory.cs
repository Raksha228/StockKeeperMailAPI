using StockKeeperMail.Database.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockKeeperMail.Database.Services
{
    /// <summary>
    /// Представляет класс ContextFactory.
    /// </summary>
    public class ContextFactory
    {

        public InventoryManagementContext GetDbContext()
        {
            return new InventoryManagementContext();
        }
    }
}
