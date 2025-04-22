using Audiocast.Shared.Models;

namespace Audiocast.Client.Services;

public class AudioService
{
    private Episode? _currentEpisode;
    private double _currentTime;
    private bool _isPlaying = false;

    public event Action<Episode?>? EpisodeChanged;

    public event Action<bool>? IsPlayingChanged;

    public event Action<double>? SeekInvoked;

    public event Action<double>? TimeChanged;

    public Episode? CurrentEpisode { get => _currentEpisode; set => EpisodeChanged?.Invoke(_currentEpisode = value); }
    public double CurrentTime { get => _currentTime; set => TimeChanged?.Invoke(_currentTime = value); }
    public bool IsPlaying { get => _isPlaying; set => IsPlayingChanged?.Invoke(_isPlaying = value); }

    public void Pause()
    {
        IsPlaying = false;
    }

    public void Play(Episode episode)
    {
        CurrentEpisode = episode;
        IsPlaying = true;
    }

    public void Resume()
    {
        IsPlaying = true;
    }

    public void Seek(double time)
    {
        CurrentTime = time;
        SeekInvoked?.Invoke(CurrentTime);
    }

    public void Stop()
    {
        CurrentEpisode = null;
        IsPlaying = false;
        CurrentTime = 0;
    }
}