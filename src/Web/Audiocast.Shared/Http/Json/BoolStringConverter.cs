using System.Text.Json;
using System.Text.Json.Serialization;

namespace Audiocast.Shared.Http.Json;

internal class BoolStringConverter : JsonConverter<bool>
{
    public static readonly BoolStringConverter Singleton = new BoolStringConverter();

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