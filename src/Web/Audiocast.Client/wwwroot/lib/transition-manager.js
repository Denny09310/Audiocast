import "./virtualstate/navigation/esnext/polyfill.js"

export function initialize() {
    const controller = new AbortController();
    let direction = 'forward';

    navigation.addEventListener('navigate', event => {
        const from = event.target.currentEntry.index;
        const to = event.destination?.index ?? from;

        switch (event.navigationType) {
            case 'traverse':
                direction = to < from ? 'backward' : 'forward';
                break;

            case 'push':
            case 'replace':
                direction = 'forward';
                break;

            case 'reload':
            default:
                // keep last direction
                break;
        }
    });

    return {
        beginTransition: async () => {
            let resolver = { resolve: () => { }, reject: () => { } };

            if (!document.startViewTransition) {
                return resolver;
            }

            const promise = new Promise((resolve, reject) => (resolver = { resolve, reject }));

            await new Promise((resolve) => {
                document.startViewTransition({
                    update: async () => {
                        resolve();
                        await promise;
                    },
                    types: ['slide', direction],
                });
            });

            return resolver;
        },
        dispose: () => controller.abort()
    }
}