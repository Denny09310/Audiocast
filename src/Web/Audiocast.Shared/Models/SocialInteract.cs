#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class SocialInteract
{
    [JsonPropertyName("url")]
    public Uri Url { get; set; }

    [JsonPropertyName("protocol")]
    public string Protocol { get; set; }

    [JsonPropertyName("accountId")]
    public string AccountId { get; set; }

    [JsonPropertyName("accountUrl")]
    public Uri AccountUrl { get; set; }

    [JsonPropertyName("priority")]
    public long Priority { get; set; }
}

#pragma warning restore CS8618