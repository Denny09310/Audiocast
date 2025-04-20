using Audiocast.Shared.Models.Responses;
using Refit;
using System.Globalization;

namespace Audiocast.Shared.Http;

public interface IFeedClient
{
    public Task<IApiResponse<TrendingResponse>> GetTrendingsAsync(
       int min = 10,
       string? lang = default,
       long? since = null,
       IEnumerable<string>? include = null,
       IEnumerable<string>? exclude = null)
    {
        lang ??= CultureInfo.CurrentCulture.Name;
        return GetTrendingsInternalAsync(min, lang, since, include, exclude);
    }

    #region Internals

    [Get("/feed/1.0/podcasts/trending")]
    internal Task<IApiResponse<TrendingResponse>> GetTrendingsInternalAsync(
        int min = 10,
        string? lang = default,
        long? since = null,
        [AliasAs("cat")] IEnumerable<string>? include = null,
        [AliasAs("noncat")] IEnumerable<string>? exclude = null);

    #endregion Internals
}