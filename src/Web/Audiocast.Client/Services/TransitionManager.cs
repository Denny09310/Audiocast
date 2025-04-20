using Microsoft.JSInterop;

namespace Audiocast.Client.Services;

public class TransitionManager(IJSRuntime runtime) : IAsyncDisposable
{
    private readonly Lazy<ValueTask<IJSObjectReference>> _module = new(
        () => runtime.InvokeAsync<IJSObjectReference>("import", "./scripts/transition-manager.js"));

    private IJSObjectReference? _resolver;

    public async Task PrepareTransitionAsync()
    {
        var module = await _module.Value;
        await module.InvokeVoidAsync("prepareTransition");
    }

    public async ValueTask DisposeAsync()
    {
        await RejectTransitionAsync();

        if (_module.IsValueCreated)
        {
            var module = await _module.Value;
            await module.DisposeAsync();
        }

        GC.SuppressFinalize(this);
    }

    public async Task EndTransitionAsync()
    {
        if (_resolver is null)
        {
            return;
        }

        await _resolver.InvokeVoidAsync("resolve");
        await _resolver.DisposeAsync();

        _resolver = null;
    }

    public async Task StartTransitionAsync()
    {
        await RejectTransitionAsync();
        var module = await _module.Value;
        _resolver = await module.InvokeAsync<IJSObjectReference>("startTransition");
    }

    private async Task RejectTransitionAsync()
    {
        if (_resolver is null)
        {
            return;
        }

        await _resolver.InvokeVoidAsync("reject");
        await _resolver.DisposeAsync();

        _resolver = null;
    }
}