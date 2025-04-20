using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Audiocast.Shared.Http.Json;

public class TimeOnlyConverter(string? serializationFormat) : JsonConverter<TimeOnly>
{
    private readonly string serializationFormat = serializationFormat ?? "HH:mm:ss.fff";

    public TimeOnlyConverter() : this(null) { }

    public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return TimeOnly.Parse(value!, CultureInfo.CurrentCulture);
    }

    public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.ToString(serializationFormat));
}