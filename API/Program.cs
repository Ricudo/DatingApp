using API.Extensions;
using API.Middleware;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using API.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddlware>();

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins("https://localhost:4200"));

// important! afte Cors before MapControllers
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error ocured during migration");
}

app.Run();