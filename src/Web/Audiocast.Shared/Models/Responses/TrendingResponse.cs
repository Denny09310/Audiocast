#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models.Responses;

public class TrendingResponse
{
    [JsonPropertyName("status")]
    public string Status { get; set; }

    [JsonPropertyName("feeds")]
    public List<Trending> Trendings { get; set; }

    [JsonPropertyName("count")]
    public long Count { get; set; }

    [JsonPropertyName("max")]
    public long? Max { get; set; }

    [JsonPropertyName("since")]
    public long? Since { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }
}

#pragma warning restore CS8618