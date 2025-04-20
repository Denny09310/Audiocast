using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(context => context.AddAuthorizationHeaders());

builder.Services.AddOutputCache(options => options.AddBasePolicy(policy => policy
    .Expire(TimeSpan.FromSeconds(30))));

builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()));

var app = builder.Build();

app.MapDefaultEndpoints();

app.UseHttpsRedirection();
app.UseCors();

app.MapReverseProxy(proxy => proxy
   .UseOutputCache());

app.Run();