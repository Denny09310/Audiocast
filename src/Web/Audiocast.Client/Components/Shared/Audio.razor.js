export function initialize(element) {
    const controller = new AbortController();

    return {
        play: () => element.play(),
        pause: () => element.pause(),
        seekTime: (time) => element.currentTime = time,
        setVolume: (volume) => element.volume = volume,
        dispose: () => controller.abort(),
    }
}