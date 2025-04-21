#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Soundbite
{
    [JsonPropertyName("startTime")]
    public long StartTime { get; set; }

    [JsonPropertyName("duration")]
    public long Duration { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }
}

#pragma warning restore CS8618