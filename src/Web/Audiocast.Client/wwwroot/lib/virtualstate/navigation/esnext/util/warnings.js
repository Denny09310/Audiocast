const THIS_WILL_BE_REMOVED = "This will be removed when the first major release of @virtualstate/navigation is published";
const WARNINGS = {
    EVENT_INTERCEPT_HANDLER: `You are using a non standard interface, please update your code to use event.intercept({ async handler() {} })\n${THIS_WILL_BE_REMOVED}`
};
let GLOBAL_IS_WARNINGS_IGNORED = false;
let GLOBAL_IS_WARNINGS_TRACED = true;
export function setIgnoreWarnings(ignore) {
    GLOBAL_IS_WARNINGS_IGNORED = ignore;
}
export function setTraceWarnings(ignore) {
    GLOBAL_IS_WARNINGS_TRACED = ignore;
}
export function logWarning(warning, ...message) {
    if (GLOBAL_IS_WARNINGS_IGNORED) {
        return;
    }
    try {
        if (GLOBAL_IS_WARNINGS_TRACED) {
            console.trace(WARNINGS[warning], ...message);
        }
        else {
            console.warn(WARNINGS[warning], ...message);
        }
    }
    catch {
        // We don't want attempts to log causing issues
        // maybe we don't have a console
    }
}
//# sourceMappingURL=warnings.js.map