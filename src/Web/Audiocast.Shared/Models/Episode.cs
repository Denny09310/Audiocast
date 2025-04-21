#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Episode
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("link")]
    public Uri Link { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("guid")]
    public string Guid { get; set; }

    [JsonPropertyName("datePublished")]
    public DateTimeOffset DatePublished { get; set; }

    [JsonPropertyName("datePublishedPretty")]
    public string DatePublishedPretty { get; set; }

    [JsonPropertyName("dateCrawled")]
    public DateTimeOffset DateCrawled { get; set; }

    [JsonPropertyName("enclosureUrl")]
    public Uri EnclosureUrl { get; set; }

    [JsonPropertyName("enclosureType")]
    public string EnclosureType { get; set; }

    [JsonPropertyName("enclosureLength")]
    public long EnclosureLength { get; set; }

    [JsonPropertyName("duration")]
    public TimeSpan? Duration { get; set; }

    [JsonPropertyName("explicit")]
    public int Explicit { get; set; }

    [JsonPropertyName("episode")]
    public int? Number { get; set; }

    [JsonPropertyName("episodeType")]
    public string? Type { get; set; }

    [JsonPropertyName("season")]
    public int? Season { get; set; }

    [JsonPropertyName("image")]
    public Uri Image { get; set; }

    [JsonPropertyName("feedItunesId")]
    public long? FeedItunesId { get; set; }

    [JsonPropertyName("feedUrl")]
    public Uri FeedUrl { get; set; }

    [JsonPropertyName("feedImage")]
    public Uri FeedImage { get; set; }

    [JsonPropertyName("feedId")]
    public long FeedId { get; set; }

    [JsonPropertyName("podcastGuid")]
    public Guid PodcastGuid { get; set; }

    [JsonPropertyName("feedLanguage")]
    public string FeedLanguage { get; set; }

    [JsonPropertyName("feedDead")]
    public long FeedDead { get; set; }

    [JsonPropertyName("feedDuplicateOf")]
    public long? FeedDuplicateOf { get; set; }

    [JsonPropertyName("chaptersUrl")]
    public Uri? ChaptersUrl { get; set; }

    [JsonPropertyName("transcriptUrl")]
    public Uri? TranscriptUrl { get; set; }

    [JsonPropertyName("transcripts")]
    public Transcript[]? Transcripts { get; set; }

    [JsonPropertyName("soundbite")]
    public Soundbite? Soundbite { get; set; }

    [JsonPropertyName("soundbites")]
    public Soundbite[]? Soundbites { get; set; }

    [JsonPropertyName("persons")]
    public Person[]? Persons { get; set; }

    [JsonPropertyName("socialInteract")]
    public SocialInteract[]? SocialInteract { get; set; }

    [JsonPropertyName("value")]
    public Value? Value { get; set; }
}

#pragma warning restore CS8618