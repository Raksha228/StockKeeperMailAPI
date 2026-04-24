using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.Api;

namespace StockKeeperMail.Desktop.Tests;

public class EntityKeyHelperTests
{
    [Fact]
    public void GetKeyProperties_ForOrderDetail_ReturnsCompositeKeysInAlphabeticalOrder()
    {
        string[] keyNames = EntityKeyHelper.GetKeyProperties(typeof(OrderDetail))
            .Select(property => property.Name)
            .ToArray();

        Assert.Equal(new[] { "OrderID", "ProductID" }, keyNames);
    }

    [Fact]
    public void GetSingleKeyValue_ForRole_ReturnsRoleId()
    {
        Guid roleId = Guid.NewGuid();
        Role role = new Role { RoleID = roleId };

        object? key = EntityKeyHelper.GetSingleKeyValue(role);

        Assert.Equal(roleId, key);
    }

    [Fact]
    public void FindBySingleKey_ReturnsMatchingEntity()
    {
        Guid firstId = Guid.NewGuid();
        Guid secondId = Guid.NewGuid();
        List<Role> roles =
        [
            new Role { RoleID = firstId, RoleName = "Продавец" },
            new Role { RoleID = secondId, RoleName = "Администратор" }
        ];

        Role? foundRole = EntityKeyHelper.FindBySingleKey(roles, secondId);

        Assert.NotNull(foundRole);
        Assert.Equal("Администратор", foundRole!.RoleName);
    }

    [Fact]
    public void FindBySingleKey_WhenKeyIsMissing_ReturnsNull()
    {
        List<Role> roles =
        [
            new Role { RoleID = Guid.NewGuid(), RoleName = "Продавец" }
        ];

        Role? foundRole = EntityKeyHelper.FindBySingleKey(roles, Guid.NewGuid());

        Assert.Null(foundRole);
    }
}
