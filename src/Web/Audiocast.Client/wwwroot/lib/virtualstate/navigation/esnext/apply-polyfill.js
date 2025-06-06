import { DEFAULT_POLYFILL_OPTIONS, getCompletePolyfill } from "./get-polyfill.js";
import { getNavigation } from "./get-navigation.js";
import { globalNavigation } from "./global-navigation.js";
export function applyPolyfill(options = DEFAULT_POLYFILL_OPTIONS) {
    const { apply, navigation } = getCompletePolyfill(options);
    apply();
    return navigation;
}
export function shouldApplyPolyfill(navigation = getNavigation()) {
    const globalThat = globalThis;
    return (navigation !== globalNavigation &&
        !Object.hasOwn(globalThat, 'navigation') &&
        typeof window !== "undefined");
}
//# sourceMappingURL=apply-polyfill.js.map