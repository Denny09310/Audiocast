using System.Globalization;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace Audiocast.Shared.Http.Json;

internal class IsoDateTimeOffsetConverter : JsonConverter<DateTimeOffset>
{
    public static readonly IsoDateTimeOffsetConverter Singleton = new();
    private const string DefaultDateTimeFormat = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK";
    private CultureInfo? _culture;
    private string? _dateTimeFormat;

    public CultureInfo Culture
    {
        get => _culture ?? CultureInfo.CurrentCulture;
        set => _culture = value;
    }

    public string? DateTimeFormat
    {
        get => _dateTimeFormat ?? string.Empty;
        set => _dateTimeFormat = string.IsNullOrEmpty(value) ? null : value;
    }

    public DateTimeStyles DateTimeStyles { get; set; } = DateTimeStyles.RoundtripKind;

    public override DateTimeOffset Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
        {
            reader.Skip();
            return default;
        }
        if (reader.TokenType == JsonTokenType.String)
        {
            return FromString(ref reader);
        }
        if (reader.TokenType == JsonTokenType.Number)
        {
            long ticks = reader.GetInt64();
            return DateTimeOffset.FromUnixTimeSeconds(ticks);
        }
        throw new JsonException($"Unexpected token parsing date. Expected String, got {reader.TokenType}.");
    }

    public override void Write(Utf8JsonWriter writer, DateTimeOffset value, JsonSerializerOptions options)
    {
        string text;

        if ((DateTimeStyles & DateTimeStyles.AdjustToUniversal) == DateTimeStyles.AdjustToUniversal || 
            (DateTimeStyles & DateTimeStyles.AssumeUniversal) == DateTimeStyles.AssumeUniversal)
        {
            value = value.ToUniversalTime();
        }

        text = value.ToString(_dateTimeFormat ?? DefaultDateTimeFormat, Culture);

        writer.WriteStringValue(text);
    }

    private DateTimeOffset FromString(ref Utf8JsonReader reader)
    {
        string? dateText = reader.GetString();

        if (!string.IsNullOrEmpty(dateText))
        {
            if (!string.IsNullOrEmpty(_dateTimeFormat))
            {
                return DateTimeOffset.ParseExact(dateText, _dateTimeFormat, Culture, DateTimeStyles);
            }
            else
            {
                return DateTimeOffset.Parse(dateText, Culture, DateTimeStyles);
            }
        }
        else
        {
            return default;
        }
    }
}