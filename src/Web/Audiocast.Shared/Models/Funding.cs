#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Funding
{
    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("url")]
    public Uri? Url { get; set; }
}

#pragma warning restore CS8618
