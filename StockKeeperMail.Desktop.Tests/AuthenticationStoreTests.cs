using StockKeeperMail.Database.Models;
using StockKeeperMail.Desktop.Stores;

namespace StockKeeperMail.Desktop.Tests;

public class AuthenticationStoreTests
{
    [Fact]
    public void SettingCurrentStaff_RaisesCurrentStaffChangedEvent()
    {
        AuthenticationStore store = new AuthenticationStore();
        int eventRaisedCount = 0;
        store.IsCurrentStaffChanged += () => eventRaisedCount++;

        store.CurrentStaff = new Staff { StaffID = Guid.NewGuid(), StaffUsername = "admin" };

        Assert.Equal(1, eventRaisedCount);
    }

    [Fact]
    public void SettingIsLoggedIn_RaisesIsLoggedInChangedEvent()
    {
        AuthenticationStore store = new AuthenticationStore();
        int eventRaisedCount = 0;
        store.IsLoggedInChanged += () => eventRaisedCount++;

        store.IsLoggedIn = true;

        Assert.Equal(1, eventRaisedCount);
    }
}
