using Audiocast.Shared.Extensions;
using System.Globalization;

namespace Audiocast.Shared.Models.Requests;

public class TrendingRequest
{
    public static readonly TrendingRequest Default = new() { Max = 10, Language = CultureInfo.CurrentCulture.Name };

    [Alias("notcategory")]
    public string? Excludes { get; set; }

    [Alias("cat")]
    public string? Includes { get; set; }

    [Alias("lang")]
    public string? Language { get; set; }

    [Alias("max")]
    public int? Max { get; set; }

    [Alias("since")]
    public long? Since { get; set; }
}