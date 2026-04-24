using StockKeeperMail.Api.Data;
using StockKeeperMail.Database.Models;
using System.ComponentModel.DataAnnotations;

namespace StockKeeperMail.Api.Tests;

public class EntityKeyFilterBuilderTests
{
    [Fact]
    public void GetKeyProperties_ForCompositeEntity_ReturnsOrderedKeys()
    {
        string[] keyNames = EntityKeyFilterBuilder
            .GetKeyProperties(typeof(OrderDetail))
            .Select(property => property.Name)
            .ToArray();

        Assert.Equal(new[] { "OrderID", "ProductID" }, keyNames);
    }

    [Fact]
    public void Build_ForSingleKeyEntity_CreatesSimpleFilterDefinition()
    {
        Role role = new Role
        {
            RoleID = Guid.NewGuid(),
            RoleName = "Администратор"
        };

        var filter = EntityKeyFilterBuilder.Build(role);

        Assert.NotNull(filter);
        Assert.Contains("SimpleFilterDefinition", filter.GetType().Name);
    }

    [Fact]
    public void Build_ForCompositeKeyEntity_CreatesAndFilterDefinition()
    {
        OrderDetail orderDetail = new OrderDetail
        {
            OrderID = Guid.NewGuid(),
            ProductID = Guid.NewGuid(),
            OrderDetailQuantity = 2,
            OrderDetailAmount = 1500m
        };

        var filter = EntityKeyFilterBuilder.Build(orderDetail);

        Assert.NotNull(filter);
        Assert.Contains("AndFilterDefinition", filter.GetType().Name);
    }

    [Fact]
    public void Build_ForNullEntity_ThrowsArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() => EntityKeyFilterBuilder.Build<Role>(null!));
    }

    [Fact]
    public void Build_ForEntityWithoutKey_ThrowsInvalidOperationException()
    {
        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(() => EntityKeyFilterBuilder.Build(new EntityWithoutKey()));

        Assert.Contains("не содержит свойств с атрибутом [Key]", exception.Message);
    }

    private sealed class EntityWithoutKey
    {
        public Guid Id { get; set; }
    }
}
