#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Model
{
    [JsonPropertyName("method")]
    public string Method { get; set; }

    [JsonPropertyName("suggested")]
    public string? Suggested { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }
}

#pragma warning restore CS8618
