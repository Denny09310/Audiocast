namespace Audiocast.Client.Events;

public class TimeUpdateEventArgs : EventArgs
{
    public double CurrentTime { get; set; }
    public double Duration { get; set; }
}