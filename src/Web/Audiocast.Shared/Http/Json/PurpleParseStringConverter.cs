using System.Text.Json.Serialization;
using System.Text.Json;

namespace Audiocast.Shared.Http.Json;

internal class PurpleParseStringConverter : JsonConverter<long>
{
    public static readonly PurpleParseStringConverter Singleton = new();

    public override long Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (long.TryParse(value, out long l))
        {
            return l;
        }
        throw new InvalidOperationException("Cannot unmarshal type long");
    }

    public override void Write(Utf8JsonWriter writer, long value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, value.ToString(), options);
    }
}
