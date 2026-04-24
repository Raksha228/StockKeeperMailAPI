using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.Api;

namespace StockKeeperMail.Desktop.Tests;

public class ApiRouteMapperDesktopTests
{
    [Fact]
    public void GetRoute_ForKnownEntity_ReturnsExpectedRoute()
    {
        string route = ApiRouteMapper.GetRoute<ProductLocation>();

        Assert.Equal("product-locations", route);
    }

    [Fact]
    public void GetRoute_ForUnknownEntity_ThrowsInvalidOperationException()
    {
        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(() => ApiRouteMapper.GetRoute<UnknownEntity>());

        Assert.Contains("не найден маршрут API", exception.Message);
    }

    private sealed class UnknownEntity
    {
    }
}
