#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models.Responses;

public class CategoriesResponse
{
    [JsonPropertyName("status")]
    public string Status { get; set; }

    [JsonPropertyName("count")]
    public long Count { get; set; }

    [JsonPropertyName("feeds")]
    public List<Category> Categories { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }
}

#pragma warning restore CS8618