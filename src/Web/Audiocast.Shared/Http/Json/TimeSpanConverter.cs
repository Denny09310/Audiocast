using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Audiocast.Shared.Http.Json;

public class TimeSpanConverter : JsonConverter<TimeSpan>
{
    public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
        {
            reader.Skip();
            return default;
        }
        if (reader.TokenType == JsonTokenType.String)
        {
            var value = reader.GetString();
            return TimeSpan.Parse(value!, CultureInfo.CurrentCulture);
        }
        if (reader.TokenType == JsonTokenType.Number)
        {
            long ticks = reader.GetInt64();
            return TimeSpan.FromTicks(ticks);
        }
        throw new JsonException($"Unexpected token parsing TimeSpan. Expected String or Number, got {reader.TokenType}.");
    }

    public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.ToString());
}