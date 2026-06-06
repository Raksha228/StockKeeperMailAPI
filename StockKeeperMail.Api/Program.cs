using StockKeeperMail.Api.Data;
using StockKeeperMail.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbOptions>(builder.Configuration.GetSection("MongoDB"));

builder.Services.AddSingleton<MongoDatabaseProvider>();
builder.Services.AddScoped(typeof(MongoRepository<>));
builder.Services.AddScoped(typeof(GenericEntityService<>));
builder.Services.AddScoped<EntityHydrationService>();
builder.Services.AddScoped<OrderAggregateService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Критично: API не должен запускаться без реально доступной MongoDB.
// Создание MongoClient не проверяет соединение, поэтому здесь выполняется ping.
using (IServiceScope scope = app.Services.CreateScope())
{
    MongoDatabaseProvider databaseProvider = scope.ServiceProvider.GetRequiredService<MongoDatabaseProvider>();
    try
    {
        databaseProvider.PingAsync().GetAwaiter().GetResult();
        app.Logger.LogInformation("MongoDB доступна. База данных: {DatabaseName}", databaseProvider.DatabaseName);
    }
    catch (Exception exception)
    {
        app.Logger.LogCritical(exception,
            "MongoDB недоступна. API остановлен. Проверь, что MongoDB запущена и строка MongoDB:ConnectionString в appsettings.json корректна.");
        throw;
    }
}

app.UseRouting();
app.MapControllers();

app.Run();

public partial class Program
{
}
