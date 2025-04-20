using System.Text.Json;

namespace Audiocast.Shared.Http.Json;

internal static class Converter
{
    public static readonly JsonSerializerOptions Settings = new(JsonSerializerDefaults.General)
    {
        Converters =
        {
            new DateOnlyConverter(),
            new TimeOnlyConverter(),
            IsoDateTimeOffsetConverter.Singleton
        },
    };
}