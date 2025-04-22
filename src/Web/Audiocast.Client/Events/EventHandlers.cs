using Microsoft.AspNetCore.Components;

namespace Audiocast.Client.Events;

[EventHandler("oncustomtimeupdate", typeof(TimeUpdateEventArgs), true, true)]
public static class EventHandlers;
