using Audiocast.Shared.Http;
using Audiocast.Shared.Http.Json;
using Audiocast.Shared.Models.Responses;
using Refit;
using System.Globalization;

namespace Audiocast.Shared.Http
{
    public interface IFeedClient
    {
        [Get("/feed/1.0/categories/list")]
        public Task<IApiResponse<CategoriesResponse>> GetCategoriesAsync(
            CancellationToken ct = default);

        [Get("/feed/1.0/episodes/bypodcastguid")]
        public Task<IApiResponse<EpisodesResponse>> GetEpisodesByPodcastGuidAsync(
            Guid guid,
            CancellationToken ct = default);

        [Get("/feed/1.0/podcasts/byfeedid")]
        public Task<IApiResponse<PodcastsResponse>> GetPodcastByFeedIdAsync(
            [AliasAs("id")] long feedId,
            CancellationToken ct = default);

        [Get("/feed/1.0/podcasts/byguid")]
        public Task<IApiResponse<PodcastsResponse>> GetPodcastByGuidAsync(
            Guid guid,
            CancellationToken ct = default);

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
}

namespace Microsoft.Extensions.DependencyInjection
{
    public static class FeedClientExtensions
    {
        public static IServiceCollection AddFeedClient(
            this IServiceCollection services,
            string baseUrl,
            Action<IHttpClientBuilder> builder = null!)
        {
            var http = services.AddRefitClient<IFeedClient>(new RefitSettings()
            {
                ContentSerializer = new SystemTextJsonContentSerializer(Converter.Settings),
            })
            .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl));

            builder?.Invoke(http);

            return services;
        }
    }
}