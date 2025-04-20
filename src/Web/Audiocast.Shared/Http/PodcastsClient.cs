using Audiocast.Shared.Models.Responses;
using Refit;
using System.Globalization;

namespace Audiocast.Shared.Http;

public interface IFeedClient
{
    public Task<IApiResponse<TrendingResponse>> GetTrendingsAsync(
       int max = 10,
       string? lang = default,
       long? since = null,
       IEnumerable<string>? include = null,
       IEnumerable<string>? exclude = null,
       CancellationToken ct = default)
    {
        lang ??= CultureInfo.CurrentCulture.Name;
        return GetTrendingsInternalAsync(max, lang, since, include, exclude, ct);
    }

    [Get("/feed/1.0/categories/list")]
    public Task<IApiResponse<CategoriesResponse>> GetCategoriesAsync(
        CancellationToken ct = default);

    #region Internals

    [Get("/feed/1.0/podcasts/trending")]
    internal Task<IApiResponse<TrendingResponse>> GetTrendingsInternalAsync(
        int max = 10,
        string? lang = default,
        long? since = null,
        [AliasAs("cat")] IEnumerable<string>? include = null,
        [AliasAs("noncat")] IEnumerable<string>? exclude = null,
        CancellationToken ct = default);

    #endregion Internals
}