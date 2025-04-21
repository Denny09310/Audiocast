#pragma warning disable CS8618

using Audiocast.Shared.Http.Json;
using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models.Responses;

public partial class EpisodeResponse
{
    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("episode")]
    public Episode Episode { get; set; }

    [JsonPropertyName("status")]
    [JsonConverter(typeof(ParseBoolConverter))]
    public bool Status { get; set; }
}

#pragma warning restore CS8618