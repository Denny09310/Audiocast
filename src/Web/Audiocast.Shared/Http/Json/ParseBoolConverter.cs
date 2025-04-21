using System.Text.Json.Serialization;
using System.Text.Json;

namespace Audiocast.Shared.Http.Json;

internal class ParseBoolConverter : JsonConverter<bool>
{
    public static readonly ParseBoolConverter Singleton = new();

    public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (bool.TryParse(value, out bool b))
        {
            return b;
        }
        throw new InvalidOperationException("Cannot unmarshal type bool");
    }

    public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
    {
        var boolString = value ? "true" : "false";
        JsonSerializer.Serialize(writer, boolString, options);
    }
}
