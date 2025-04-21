#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Podcast
{
    [JsonPropertyName("artwork")]
    public Uri Artwork { get; set; }

    [JsonPropertyName("author")]
    public string Author { get; set; }

    [JsonPropertyName("categories")]
    public Dictionary<string, string> Categories { get; set; }

    [JsonPropertyName("chash")]
    public string Chash { get; set; }

    [JsonPropertyName("contentType")]
    public string ContentType { get; set; }

    [JsonPropertyName("crawlErrors")]
    public long CrawlErrors { get; set; }

    [JsonPropertyName("dead")]
    public long Dead { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("episodeCount")]
    public long EpisodeCount { get; set; }

    [JsonPropertyName("explicit")]
    public bool Explicit { get; set; }

    [JsonPropertyName("funding")]
    public Funding Funding { get; set; }

    [JsonPropertyName("generator")]
    public string Generator { get; set; }

    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("image")]
    public Uri Image { get; set; }

    [JsonPropertyName("imageUrlHash")]
    public long ImageUrlHash { get; set; }

    [JsonPropertyName("itunesId")]
    public long? ItunesId { get; set; }

    [JsonPropertyName("itunesType")]
    public string ItunesType { get; set; }

    [JsonPropertyName("language")]
    public string Language { get; set; }

    [JsonPropertyName("lastCrawlTime")]
    public long LastCrawlTime { get; set; }

    [JsonPropertyName("lastGoodHttpStatusTime")]
    public long LastGoodHttpStatusTime { get; set; }

    [JsonPropertyName("lastHttpStatus")]
    public long LastHttpStatus { get; set; }

    [JsonPropertyName("lastParseTime")]
    public long LastParseTime { get; set; }

    [JsonPropertyName("lastUpdateTime")]
    public long LastUpdateTime { get; set; }

    [JsonPropertyName("link")]
    public Uri Link { get; set; }

    [JsonPropertyName("locked")]
    public long Locked { get; set; }

    [JsonPropertyName("medium")]
    public string Medium { get; set; }

    [JsonPropertyName("originalUrl")]
    public Uri OriginalUrl { get; set; }

    [JsonPropertyName("ownerName")]
    public string OwnerName { get; set; }

    [JsonPropertyName("parseErrors")]
    public long ParseErrors { get; set; }

    [JsonPropertyName("podcastGuid")]
    public Guid Guid { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("type")]
    public long Type { get; set; }

    [JsonPropertyName("url")]
    public Uri Url { get; set; }

    [JsonPropertyName("value")]
    public Value Value { get; set; }
}

#pragma warning restore CS8618
