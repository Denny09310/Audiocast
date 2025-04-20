#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public class Trending
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("url")]
    public Uri Url { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("author")]
    public string Author { get; set; }

    [JsonPropertyName("image")]
    public Uri Image { get; set; }

    [JsonPropertyName("artwork")]
    public Uri Artwork { get; set; }

    [JsonPropertyName("newestItemPublishTime")]
    public long NewestItemPublishTime { get; set; }

    [JsonPropertyName("itunesId")]
    public long? ItunesId { get; set; }

    [JsonPropertyName("trendScore")]
    public long TrendScore { get; set; }

    [JsonPropertyName("language")]
    public string Language { get; set; }

    [JsonPropertyName("categories")]
    public Dictionary<string, string> Categories { get; set; }
}

#pragma warning restore CS8618 