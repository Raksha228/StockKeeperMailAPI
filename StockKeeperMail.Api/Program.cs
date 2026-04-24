using StockKeeperMail.Api.Data;
using StockKeeperMail.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbOptions>(builder.Configuration.GetSection("MongoDb"));

builder.Services.AddSingleton<MongoDatabaseContext>();
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

app.UseRouting();
app.MapControllers();

app.Run();

public partial class Program
{
}
