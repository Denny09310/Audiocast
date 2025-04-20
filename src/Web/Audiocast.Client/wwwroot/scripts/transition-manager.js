let current = history.state?.index ?? 0;
let direction = 'forward';

if (!history.state || typeof history.state.index !== 'number') {
    history.replaceState({ ...history.state, index: current }, '');
}

history.pushState = new Proxy(history.pushState, {
    apply(target, thisArg, args) {
        const [state, title, url] = args;
        current++;
        direction = 'forward';
        return Reflect.apply(target, thisArg, [{ ...state, index: current }, title, url]);
    }
});

history.replaceState = new Proxy(history.replaceState, {
    apply(target, thisArg, args) {
        const [state, title, url] = args;
        return Reflect.apply(target, thisArg, [{ ...state, index: current }, title, url]);
    }
});

export function prepareTransition() {
    const state = history.state ?? {};
    if (!state) history.replaceState({ ...state, index: current + 1 }, '');
    const index = typeof state.index === 'number' ? state.index : current + 1;
    direction = index > current ? 'forward' : 'backward';
    current = index;
}

export async function startTransition() {
    const resolver = {
        resolve: () => { },
        reject: () => { }
    };

    if (!document.startViewTransition) {
        return resolver;
    }

    const promise = new Promise((resolve, reject) => {
        resolver.resolve = resolve;
        resolver.reject = reject;
    });

    await new Promise((resolve) => {
        document.startViewTransition({
            update: async () => {
                resolve();
                await promise;
            },
            types: ['slide', direction]
        });
    });

    return resolver;
}