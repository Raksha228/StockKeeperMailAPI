using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.ViewModels;

namespace StockKeeperMail.Desktop.Tests;

public class RolePrivilegesHelperTests
{
    [Fact]
    public void Constructor_WithRole_CopiesPrivilegesToViewModel()
    {
        Role role = new Role
        {
            OrdersView = true,
            OrdersAdd = true,
            CustomersEdit = true,
            ProductsDelete = true,
            LogsView = true,
            RolesAdd = true,
            StaffsDelete = true
        };

        RolePrivilegesHelper helper = new RolePrivilegesHelper(role);

        Assert.True(helper.OrdersView);
        Assert.True(helper.OrdersAdd);
        Assert.True(helper.CustomersEdit);
        Assert.True(helper.ProductsDelete);
        Assert.True(helper.LogsView);
        Assert.True(helper.RolesAdd);
        Assert.True(helper.StaffsDelete);
        Assert.False(helper.OrdersDelete);
        Assert.False(helper.CategoriesView);
    }
}
