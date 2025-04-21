#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Destination
{
    [JsonPropertyName("address")]
    public string Address { get; set; }

    [JsonPropertyName("customKey")]
    public string? CustomKey { get; set; }

    [JsonPropertyName("customValue")]
    public string? CustomValue { get; set; }

    [JsonPropertyName("fee")]
    public bool? Fee { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("split")]
    public long Split { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }
}

#pragma warning restore CS8618
