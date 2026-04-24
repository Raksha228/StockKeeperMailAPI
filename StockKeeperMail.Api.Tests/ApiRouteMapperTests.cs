using StockKeeperMail.Api.Data;
using StockKeeperMail.Database.Models;

namespace StockKeeperMail.Api.Tests;

public class ApiRouteMapperTests
{
    [Fact]
    public void GetRoute_ForKnownEntity_ReturnsExpectedRoute()
    {
        string route = ApiRouteMapper.GetRoute<Role>();

        Assert.Equal("roles", route);
    }

    [Fact]
    public void GetRoute_ForAnotherKnownEntity_ReturnsExpectedRoute()
    {
        string route = ApiRouteMapper.GetRoute<OrderDetail>();

        Assert.Equal("order-details", route);
    }

    [Fact]
    public void GetRoute_ForUnknownEntity_ThrowsInvalidOperationException()
    {
        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(() => ApiRouteMapper.GetRoute<UnknownEntity>());

        Assert.Contains("не зарегистрирован маршрут API", exception.Message);
    }

    private sealed class UnknownEntity
    {
    }
}
