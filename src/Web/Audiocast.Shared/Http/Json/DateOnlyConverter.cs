using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Audiocast.Shared.Http.Json;

public class DateOnlyConverter(string? serializationFormat) : JsonConverter<DateOnly>
{
    private readonly string serializationFormat = serializationFormat ?? "yyyy-MM-dd";

    public DateOnlyConverter() : this(null)
    {
    }

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return DateOnly.Parse(value!, CultureInfo.CurrentCulture);
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.ToString(serializationFormat));
}