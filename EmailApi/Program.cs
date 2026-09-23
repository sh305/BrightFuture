using EmailApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://localhost:5173",
            "http://shivam123.runasp.net",
            "https://shivam123.runasp.net"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection("Smtp")
);

builder.Services.AddScoped<EmailService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 1. Static files FIRST
app.UseDefaultFiles();
app.UseStaticFiles();

// 2. Routing start
app.UseRouting();

app.UseCors("AllowFrontend");

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? string.Empty;

    // Let controllers handle API and OpenAPI routes
    if (path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/openapi", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase))
    {
        await next();
        return;
    }

    // Static files and JSON requests
    if (path.Contains('.') ||
        context.Request.Headers.Accept.ToString()
               .Contains("application/json", StringComparison.OrdinalIgnoreCase))
    {
        await next();
        return;
    }

    var webRoot = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
    var indexPath = Path.Combine(webRoot, "index.html");
    if (!File.Exists(indexPath))
    {
        await next();
        return;
    }

    var html = await File.ReadAllTextAsync(indexPath);

    var baseHref = context.Request.PathBase.HasValue
        ? context.Request.PathBase.Value + "/"
        : "/";

    if (!baseHref.EndsWith("/")) baseHref += "/";

    html = html.Replace("%BASE_HREF%", baseHref);
    html = html.Replace(
        "<head>",
        $"<head>\n<script>window.__BASE_HREF__ = \"{baseHref}\";</script>"
    );
    context.Response.ContentType = "text/html; charset=utf-8";
    await context.Response.WriteAsync(html);
});

// 3. API endpoints
app.MapControllers();

// 4. SPA fallback LAST
app.MapFallbackToFile("index.html");

app.Run();
