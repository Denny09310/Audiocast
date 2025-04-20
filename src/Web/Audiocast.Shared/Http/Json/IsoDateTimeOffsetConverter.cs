using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Audiocast.Shared.Http.Json;

internal class IsoDateTimeOffsetConverter : JsonConverter<DateTimeOffset>
{
    public static readonly IsoDateTimeOffsetConverter Singleton = new IsoDateTimeOffsetConverter();

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

    public override bool CanConvert(Type t) => t == typeof(DateTimeOffset);

    public override DateTimeOffset Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.TokenType switch
        {
            JsonTokenType.String => ReadFromString(ref reader),
            JsonTokenType.Number => ReadFromNumber(ref reader),
            _ => default,
        };
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

    private static DateTimeOffset ReadFromNumber(ref Utf8JsonReader reader)
    {
        long dateNumber = reader.GetInt64();
        return DateTimeOffset.FromUnixTimeSeconds(dateNumber);
    }

    private DateTimeOffset ReadFromString(ref Utf8JsonReader reader)
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