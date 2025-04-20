#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public class Category
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }
}

#pragma warning restore CS8618