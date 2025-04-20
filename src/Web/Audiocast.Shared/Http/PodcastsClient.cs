using Audiocast.Shared.Extensions;
using Audiocast.Shared.Http.Json;
using Audiocast.Shared.Models.Requests;
using Audiocast.Shared.Models.Responses;
using System.Net.Http.Json;

namespace Audiocast.Shared.Http;

public class FeedClient(HttpClient http)
{
    public Task<TrendingResponse?> GetTrendingsAsync(TrendingRequest? requests = null)
        => http.GetFromJsonAsync<TrendingResponse>(
            $"/feed/1.0/podcasts/trending?{(requests ?? TrendingRequest.Default).ToQueryString()}", 
            Converter.Settings);
}