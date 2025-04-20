#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models.Responses;

public partial class PodcastsResponse
{
    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("feed")]
    public Podcast Podcast { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; }
}

#pragma warning restore CS8618