#pragma warning disable CS8618

using Audiocast.Shared.Http.Json;
using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models.Responses;

public partial class EpisodesResponse
{
    [JsonPropertyName("status")]
    [JsonConverter(typeof(ParseBoolConverter))]
    public bool Status { get; set; }

    [JsonPropertyName("items")]
    public List<Episode> Episodes { get; set; }

    [JsonPropertyName("count")]
    public long Count { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }
}

#pragma warning restore CS8618