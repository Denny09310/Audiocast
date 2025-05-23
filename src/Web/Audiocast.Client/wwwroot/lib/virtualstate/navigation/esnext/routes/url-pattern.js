import { globalURLPattern as URLPattern } from "./url-pattern-global.js";
import { compositeKey } from "@virtualstate/composite-key";
export { URLPattern };
export function isURLPatternStringWildcard(pattern) {
    return pattern === "*";
}
const patternSymbols = Object.values({
    // From https://wicg.github.io/urlpattern/#parsing-patterns
    open: "{",
    close: "}",
    regexpOpen: "(",
    regexpClose: ")",
    nameStart: ":",
    asterisk: "*"
});
export const patternParts = [
    "protocol",
    "hostname",
    "username",
    "password",
    "port",
    "pathname",
    "search",
    "hash"
];
export function isURLPatternStringPlain(pattern) {
    for (const symbol of patternSymbols) {
        if (pattern.includes(symbol)) {
            return false;
        }
    }
    return true;
}
export function isURLPatternPlainPathname(pattern) {
    if (!isURLPatternStringPlain(pattern.pathname)) {
        return false;
    }
    for (const part of patternParts) {
        if (part === "pathname")
            continue;
        if (!isURLPatternStringWildcard(pattern[part])) {
            return false;
        }
    }
    return true;
}
// Note, this weak map will contain all urls
// matched in the current process.
// This may not be wanted by everyone
let execCache = undefined;
export function enableURLPatternCache() {
    execCache = execCache ?? new WeakMap();
}
export function exec(pattern, url) {
    if (!execCache) {
        return pattern.exec(url);
    }
    const key = compositeKey(pattern, ...patternParts
        .filter(part => !isURLPatternStringWildcard(pattern[part]))
        .map(part => url[part]));
    const existing = execCache.get(key);
    if (existing)
        return existing;
    if (existing === false)
        return undefined;
    const result = pattern.exec(url);
    execCache.set(key, result ?? false);
    return result;
}
//# sourceMappingURL=url-pattern.js.map