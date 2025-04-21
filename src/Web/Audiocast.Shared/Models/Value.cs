#pragma warning disable CS8618

using System.Text.Json.Serialization;

namespace Audiocast.Shared.Models;

public partial class Value
{
    [JsonPropertyName("destinations")]
    public Destination[] Destinations { get; set; }

    [JsonPropertyName("model")]
    public Model Model { get; set; }
}

#pragma warning restore CS8618
