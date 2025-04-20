using System.Security.Cryptography;
using System.Text;
using Yarp.ReverseProxy.Transforms.Builder;

namespace Yarp.ReverseProxy.Transforms;

internal static class TransformBuilderContextExtensions
{
    public static TransformBuilderContext AddAuthorizationHeaders(this TransformBuilderContext context) => context.AddRequestTransform(ctx =>
    {
        var configuration = context.Services.GetRequiredService<IConfiguration>();

        var feed = configuration.GetSection("Feed");

        var key = feed.GetValue<string>("Key");
        var secret = feed.GetValue<string>("Secret");

        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

        var hash = SHA1.HashData(Encoding.UTF8.GetBytes(key + secret + timestamp));
        var authorization = Convert.ToHexStringLower(hash);

        var request = ctx.ProxyRequest;

        request.Headers.Add("X-Auth-Date", timestamp);
        request.Headers.Add("X-Auth-Key", key);

        request.Headers.Add("Authorization", authorization);
        request.Headers.Add("User-Agent", "Audiocast/0.1");

        return ValueTask.CompletedTask;
    });
}