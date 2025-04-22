using Microsoft.JSInterop;

namespace Audiocast.Client.Services;

public class TransitionManager(IJSRuntime runtime) : IAsyncDisposable
{
    private IJSObjectReference? _module, _resolver;

    public async Task BeginTransitionAsync()
    {
        await CancelTransitionAsync();
        if (_module is null) await InitializeAsync();

        _resolver = await _module!.InvokeAsync<IJSObjectReference>("beginTransition");
    }

    public Task CancelTransitionAsync() => InvokeResolverAsync("reject");

    public async ValueTask DisposeAsync()
    {
        try
        {
            await CancelTransitionAsync();

            if (_module is not null)
            {
                await _module.InvokeVoidAsync("dispose");
                await _module.DisposeAsync();
            }
        }
        catch (JSDisconnectedException)
        {
            // This exception can be ignored
        }

        GC.SuppressFinalize(this);
    }

    public Task EndTransitionAsync() => InvokeResolverAsync("resolve");

    public async Task InitializeAsync()
    {
        await using var module = await runtime.InvokeAsync<IJSObjectReference>("import", "./lib/transition-manager.js");
        _module = await module.InvokeAsync<IJSObjectReference>("initialize");
    }

    private async Task InvokeResolverAsync(string identifier)
    {
        var resolver = Interlocked.Exchange(ref _resolver, null);
        if (resolver is null) return;

        await resolver.InvokeVoidAsync(identifier);
        await resolver.DisposeAsync();
    }
}