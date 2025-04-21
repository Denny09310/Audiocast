#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Transcript
{
    [JsonPropertyName("url")]
    public Uri Url { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }
}

#pragma warning restore CS8618