export function beforeStart() {
    Blazor.registerCustomEventType('customtimeupdate', {
        browserEventName: 'timeupdate',
        createEventArgs: event => ({
            CurrentTime: event.srcElement.currentTime,
            Duration: event.srcElement.duration,
        })
    });
}