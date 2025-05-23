import { Navigation as NavigationPolyfill, NavigationSetCurrentKey, NavigationSetEntries, NavigationSetOptions } from "./navigation.js";
import { InvalidStateError } from "./navigation-errors.js";
import { NavigationDownloadRequest, NavigationFormData, NavigationOriginalEvent, NavigationUserInitiated } from "./create-navigation-transition.js";
import { stringify, parse } from './util/serialization.js';
import { NavigationHistory } from "./history.js";
import { like, ok } from "./is.js";
import { globalWindow } from "./global-window.js";
import { globalSelf } from "./global-self.js";
import { v4 } from "./util/uuid-or-random.js";
export const NavigationKey = "__@virtualstate/navigation/key";
export const NavigationMeta = "__@virtualstate/navigation/meta";
function getWindowHistory(givenWindow = globalWindow) {
    if (typeof givenWindow === "undefined")
        return undefined;
    return givenWindow.history;
}
function getStateFromWindowHistory(givenWindow = globalWindow) {
    const history = getWindowHistory(givenWindow);
    if (!history)
        return undefined;
    const value = history.state;
    return like(value) ? value : undefined;
}
function isStateHistoryMeta(state) {
    return like(state) && state[NavigationMeta] === true;
}
function isStateHistoryWithMeta(state) {
    return like(state) && isStateHistoryMeta(state[NavigationKey]);
}
function disposeHistoryState(entry, persist) {
    if (!persist)
        return;
    if (typeof sessionStorage === "undefined")
        return;
    sessionStorage.removeItem(entry.key);
}
function getEntries(navigation, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
    let entries = navigation.entries();
    if (typeof limit === "number") {
        entries = entries.slice(-limit);
    }
    return entries.map(({ id, key, url, sameDocument }) => ({
        id,
        key,
        url,
        sameDocument
    }));
}
function getNavigationEntryMeta(navigation, entry, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
    return {
        [NavigationMeta]: true,
        currentIndex: entry.index,
        key: entry.key,
        entries: getEntries(navigation, limit),
        state: entry.getState()
    };
}
function getNavigationEntryWithMeta(navigation, entry, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
    return {
        [NavigationKey]: getNavigationEntryMeta(navigation, entry, limit)
    };
}
function setHistoryState(navigation, history, entry, persist, limit) {
    setStateInSession();
    function getSerializableState() {
        return getNavigationEntryWithMeta(navigation, entry, limit);
    }
    function setStateInSession() {
        if (typeof sessionStorage === "undefined")
            return;
        try {
            const raw = stringify(getSerializableState());
            sessionStorage.setItem(entry.key, raw);
        }
        catch { }
    }
}
function getHistoryState(history, entry) {
    return (getStateFromHistoryIfMatchingKey() ??
        getStateFromSession());
    function getStateFromHistoryDirectly() {
        try {
            return history.state;
        }
        catch {
            return undefined;
        }
    }
    function getBaseState() {
        const value = (history.originalState ??
            getStateFromHistoryDirectly());
        return like(value) ? value : undefined;
    }
    function getStateFromHistoryIfMatchingKey() {
        const state = getBaseState();
        if (!isStateHistoryWithMeta(state))
            return undefined;
        if (state[NavigationKey].key !== entry.key)
            return undefined;
        return state[NavigationKey].state;
    }
    function getStateFromSession() {
        if (typeof sessionStorage === "undefined")
            return undefined;
        try {
            const raw = sessionStorage.getItem(entry.key);
            if (!raw)
                return undefined;
            const state = parse(raw);
            if (!like(state))
                return undefined;
            if (!isStateHistoryWithMeta(state))
                return undefined;
            return state[NavigationKey].state;
        }
        catch {
            return undefined;
        }
    }
}
export const DEFAULT_POLYFILL_OPTIONS = Object.freeze({
    persist: true,
    persistState: true,
    history: true,
    limit: 50,
    patch: true,
    interceptEvents: true
});
export function getPolyfill(options = DEFAULT_POLYFILL_OPTIONS) {
    const { navigation } = getCompletePolyfill(options);
    return navigation;
}
function isNavigationPolyfill(navigation) {
    return (like(navigation) &&
        typeof navigation[NavigationSetEntries] === "function" &&
        typeof navigation[NavigationSetCurrentKey] === "function");
}
function getNavigationOnlyPolyfill(givenNavigation) {
    // When using as a polyfill, we will auto initiate a single
    // entry, but not cause an event for it
    const entries = [
        {
            key: v4()
        }
    ];
    const navigation = givenNavigation ?? new NavigationPolyfill({
        entries
    });
    const history = new NavigationHistory({
        navigation
    });
    return {
        navigation,
        history,
        apply() {
            if (isNavigationPolyfill(givenNavigation) && !navigation.entries().length) {
                givenNavigation[NavigationSetEntries](entries);
            }
        }
    };
}
function interceptWindowClicks(navigation, window) {
    function clickCallback(ev, aEl) {
        // console.log("<-- clickCallback -->");
        // TODO opt into queueMicrotask before process
        process();
        function process() {
            if (!isAppNavigation(ev))
                return;
            ok(ev);
            const target = aEl.getAttribute("target");
            // See target detailed here
            // https://github.com/WICG/navigation-api/blob/7b2d326b8eeb75680e568dadaa67e3bb54c9ca7f/README.md?plain=1#L1465
            if (target) {
                if (target === "_blank") {
                    // Continue with default, new window
                    return;
                }
                if (target !== window.name) {
                    // Continue with default, not current window
                    return;
                }
            }
            const options = {
                history: "auto",
                [NavigationUserInitiated]: true,
                [NavigationDownloadRequest]: aEl.download,
                [NavigationOriginalEvent]: ev,
            };
            navigation.navigate(aEl.href, options);
        }
    }
    function submitCallback(ev, form) {
        // console.log("<-- submitCallback -->");
        // TODO opt into queueMicrotask before process
        process();
        function process() {
            if (ev.defaultPrevented)
                return;
            const method = ev.submitter && 'formMethod' in ev.submitter && ev.submitter.formMethod
                ? ev.submitter.formMethod
                : form.method;
            // XXX: safe to ignore dialog method?
            if (method === 'dialog')
                return;
            const action = ev.submitter && 'formAction' in ev.submitter && ev.submitter.formAction
                ? ev.submitter.formAction
                : form.action;
            const target = form.getAttribute("target");
            // See target detailed here
            // https://github.com/WICG/navigation-api/blob/7b2d326b8eeb75680e568dadaa67e3bb54c9ca7f/README.md?plain=1#L1465
            if (target) {
                if (target === "_blank") {
                    // Continue with default, new window
                    return;
                }
                if (target !== window.name) {
                    // Continue with default, not current window
                    return;
                }
            }
            let formData;
            /* c8 ignore start */
            try {
                formData = new FormData(form);
            }
            catch {
                // For runtimes where we polyfilled the window & then evented it
                // ... for some reason
                formData = new FormData(undefined);
            }
            /* c8 ignore end */
            const params = method === 'get'
                ? new URLSearchParams([...formData].map(([k, v]) => v instanceof File ? [k, v.name] : [k, v]))
                : undefined;
            const navFormData = method === 'post'
                ? formData
                : undefined;
            // action is always a fully qualified url in browsers
            const url = new URL(action, navigation.currentEntry.url);
            if (params)
                url.search = params.toString();
            const unknownEvent = ev;
            ok(unknownEvent);
            const options = {
                history: "auto",
                [NavigationUserInitiated]: true,
                [NavigationFormData]: navFormData,
                [NavigationOriginalEvent]: unknownEvent,
            };
            navigation.navigate(url.href, options);
        }
    }
    // console.log("click event added")
    window.addEventListener("click", (ev) => {
        // console.log("click event", ev)
        if (ev.target?.ownerDocument === window.document) {
            const aEl = getAnchorFromEvent(ev); // XXX: not sure what <a> tags without href do
            if (like(aEl)) {
                clickCallback(ev, aEl);
            }
        }
    });
    window.addEventListener("submit", (ev) => {
        // console.log("submit event")
        if (ev.target?.ownerDocument === window.document) {
            const form = getFormFromEvent(ev);
            if (like(form)) {
                submitCallback(ev, form);
            }
        }
    });
}
function getAnchorFromEvent(event) {
    return matchesAncestor(getComposedPathTarget(event), "a[href]:not([data-navigation-ignore])");
}
function getFormFromEvent(event) {
    return matchesAncestor(getComposedPathTarget(event), "form:not([data-navigation-ignore])");
}
function getComposedPathTarget(event) {
    if (!event.composedPath) {
        return event.target;
    }
    const targets = event.composedPath();
    return targets[0] ?? event.target;
}
function patchGlobalScope(window, history, navigation) {
    patchGlobals();
    patchPopState();
    patchHistory();
    function patchWindow(window) {
        try {
            Object.defineProperty(window, "navigation", {
                value: navigation,
            });
        }
        catch (e) { }
        if (!window.history) {
            try {
                Object.defineProperty(window, "history", {
                    value: history,
                });
            }
            catch (e) { }
        }
    }
    function patchGlobals() {
        patchWindow(window);
        // If we don't have the global window, don't also patch global scope
        if (window !== globalWindow)
            return;
        if (globalSelf) {
            try {
                Object.defineProperty(globalSelf, "navigation", {
                    value: navigation,
                });
            }
            catch (e) { }
        }
        if (typeof globalThis !== "undefined") {
            try {
                Object.defineProperty(globalThis, "navigation", {
                    value: navigation,
                });
            }
            catch (e) { }
        }
    }
    function patchHistory() {
        if (history instanceof NavigationHistory) {
            // It's our polyfill, but probably externally passed to getPolyfill
            return;
        }
        const polyfillHistory = new NavigationHistory({
            navigation
        });
        const pushState = polyfillHistory.pushState.bind(polyfillHistory);
        const replaceState = polyfillHistory.replaceState.bind(polyfillHistory);
        const go = polyfillHistory.go.bind(polyfillHistory);
        const back = polyfillHistory.back.bind(polyfillHistory);
        const forward = polyfillHistory.forward.bind(polyfillHistory);
        const prototype = Object.getPrototypeOf(history);
        const descriptor = {
            pushState: {
                ...Object.getOwnPropertyDescriptor(prototype, "pushState"),
                value: pushState
            },
            replaceState: {
                ...Object.getOwnPropertyDescriptor(prototype, "replaceState"),
                value: replaceState
            },
            go: {
                ...Object.getOwnPropertyDescriptor(prototype, "go"),
                value: go
            },
            back: {
                ...Object.getOwnPropertyDescriptor(prototype, "back"),
                value: back
            },
            forward: {
                ...Object.getOwnPropertyDescriptor(prototype, "forward"),
                value: forward
            }
        };
        Object.defineProperties(prototype, descriptor);
        const stateDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(history), "state");
        Object.defineProperty(history, "state", {
            ...stateDescriptor,
            get() {
                // Derive history state only ever directly from navigation state
                //
                // Decouple from classic history.state
                //
                // If the original state is wanted, use history.originalState,
                // which is done on a best effort basis and may be out of alignment from
                // navigation.currentEntry.getState()
                //
                // This state will always be tied to the navigation, not the background
                // browser's history stack, which could be offset from the applications
                // expected state between moments of transition.
                //
                // The change of using navigation.currentEntry.getState()
                // in place of history.state is significant, it's shifting to a model where
                // there can be an entry only for one single operation and then replaced
                //
                // e.g.
                //
                // navigation.navigate("/1", { state: { key: 1 }});
                // navigation.navigate("/2", { state: { key: 2 }});
                // await navigation.transition?.finished;
                //
                // The above code, if ran, history.state might not keep up...
                //
                // ... In safari if we run replaceState too many times in 30 seconds
                // then we will get an exception. So, inherently we know we
                // cannot just freely make use of history.state as a deterministic like
                // reference.
                return polyfillHistory.state;
            }
        });
        Object.defineProperty(history, "originalState", {
            ...stateDescriptor
        });
    }
    function patchPopState() {
        if (!window.PopStateEvent)
            return;
        const popStateEventPrototype = window.PopStateEvent.prototype;
        if (!popStateEventPrototype)
            return;
        const descriptor = Object.getOwnPropertyDescriptor(popStateEventPrototype, "state");
        Object.defineProperty(popStateEventPrototype, "state", {
            ...descriptor,
            get() {
                const original = descriptor.get.call(this);
                if (!isStateHistoryWithMeta(original))
                    return original;
                return original[NavigationKey].state;
            }
        });
        Object.defineProperty(popStateEventPrototype, "originalState", {
            ...descriptor
        });
    }
}
export function getCompletePolyfill(options = DEFAULT_POLYFILL_OPTIONS) {
    const { persist: PERSIST_ENTRIES, persistState: PERSIST_ENTRIES_STATE, history: givenHistory, limit: patchLimit, patch: PATCH_HISTORY, interceptEvents: INTERCEPT_EVENTS, window: givenWindow = globalWindow, navigation: givenNavigation } = {
        // These are super default options, if the object de
        ...DEFAULT_POLYFILL_OPTIONS,
        ...options
    };
    // console.log({
    //   ...DEFAULT_POLYFILL_OPTIONS,
    //   ...options
    // })
    const IS_PERSIST = PERSIST_ENTRIES || PERSIST_ENTRIES_STATE;
    const window = givenWindow ?? globalWindow;
    const history = options.history && typeof options.history !== "boolean" ?
        options.history :
        getWindowHistory(window);
    if (!history) {
        return getNavigationOnlyPolyfill();
    }
    // console.log("POLYFILL LOADING");
    ok(window, "window required when using polyfill with history, this shouldn't be seen");
    // Use baseHistory so that we don't initialise entries we didn't intend to
    // if we used a polyfill history
    const historyInitialState = history?.state;
    let initialMeta = {
        [NavigationMeta]: true,
        currentIndex: -1,
        entries: [],
        key: "",
        state: undefined
    };
    if (isStateHistoryWithMeta(historyInitialState)) {
        initialMeta = historyInitialState[NavigationKey];
    }
    let initialEntries = initialMeta.entries;
    const HISTORY_INTEGRATION = !!((givenWindow || givenHistory) && history);
    if (!initialEntries.length) {
        let url = undefined;
        if (window.location?.href) {
            url = window.location.href;
        }
        let state = undefined;
        if (!isStateHistoryWithMeta(historyInitialState) && !isStateHistoryMeta(historyInitialState)) {
            // console.log("Using state history direct", historyInitialState, history.state);
            state = historyInitialState;
        }
        const key = v4();
        initialEntries = [
            {
                key,
                state,
                url
            }
        ];
        initialMeta.key = key;
        initialMeta.currentIndex = 0;
    }
    // console.log("Initial Entries", initialEntries)
    const navigationOptions = {
        entries: initialEntries,
        currentIndex: initialMeta?.currentIndex,
        currentKey: initialMeta?.key,
        getState(entry) {
            if (!HISTORY_INTEGRATION)
                return;
            return getHistoryState(history, entry);
        },
        setState(entry) {
            // console.log({
            //   setState: entry.getState(),
            //   entry
            // })
            if (!HISTORY_INTEGRATION)
                return;
            if (!entry.sameDocument)
                return;
            setHistoryState(navigation, history, entry, IS_PERSIST, patchLimit);
        },
        disposeState(entry) {
            if (!HISTORY_INTEGRATION)
                return;
            disposeHistoryState(entry, IS_PERSIST);
        }
    };
    const navigation = givenNavigation ?? new NavigationPolyfill(navigationOptions);
    const pushState = history?.pushState.bind(history);
    const replaceState = history?.replaceState.bind(history);
    const historyGo = history?.go.bind(history);
    // const back = history?.back.bind(history);
    // const forward = history?.forward.bind(history);
    // const origin = typeof location === "undefined" ? "https://example.com" : location.origin;
    return {
        navigation,
        history,
        apply() {
            // console.log("APPLYING POLYFILL TO NAVIGATION");
            if (isNavigationPolyfill(navigation)) {
                // Initialise navigation options
                navigation[NavigationSetOptions](navigationOptions);
            }
            if (HISTORY_INTEGRATION) {
                const ignorePopState = new Set();
                const ignoreCurrentEntryChange = new Set();
                navigation.addEventListener("navigate", event => {
                    if (event.destination.sameDocument) {
                        return;
                    }
                    // If the destination is not the same document, we are navigating away
                    event.intercept({
                        // Set commit after transition... and never commit!
                        commit: "after-transition",
                        async handler() {
                            // Let other tasks do something and abort if needed
                            queueMicrotask(() => {
                                if (event.signal.aborted)
                                    return;
                                submit();
                            });
                        }
                    });
                    function submit() {
                        if (like(event.originalEvent)) {
                            const anchor = getAnchorFromEvent(event.originalEvent);
                            if (anchor) {
                                return submitAnchor(anchor);
                            }
                            else {
                                const form = getFormFromEvent(event.originalEvent);
                                if (form) {
                                    return submitForm(form);
                                }
                            }
                        }
                        // Assumption that navigation event means to navigate...
                        location.href = event.destination.url;
                    }
                    function submitAnchor(element) {
                        const cloned = element.cloneNode();
                        cloned.setAttribute("data-navigation-ignore", "1");
                        cloned.click();
                    }
                    function submitForm(element) {
                        const cloned = element.cloneNode();
                        cloned.setAttribute("data-navigation-ignore", "1");
                        cloned.submit();
                    }
                });
                navigation.addEventListener("currententrychange", ({ navigationType, from }) => {
                    // console.log("<-- currententrychange event listener -->");
                    const { currentEntry } = navigation;
                    if (!currentEntry)
                        return;
                    const { key, url } = currentEntry;
                    if (ignoreCurrentEntryChange.delete(key) || !currentEntry?.sameDocument)
                        return;
                    const historyState = getNavigationEntryWithMeta(navigation, currentEntry, patchLimit);
                    // console.log("currentEntry change", historyState);
                    switch (navigationType || "replace") {
                        case "push":
                            return pushState(historyState, "", url);
                        case "replace":
                            return replaceState(historyState, "", url);
                        case "traverse":
                            const delta = currentEntry.index - from.index;
                            ignorePopState.add(key);
                            return historyGo(delta);
                        case "reload":
                        // TODO
                    }
                });
                window.addEventListener("popstate", (event) => {
                    // console.log("<-- popstate event listener -->");
                    const { state, originalState } = event;
                    const foundState = originalState ?? state;
                    if (!isStateHistoryWithMeta(foundState))
                        return;
                    const { [NavigationKey]: { key } } = foundState;
                    if (ignorePopState.delete(key))
                        return;
                    ignoreCurrentEntryChange.add(key);
                    let committed;
                    try {
                        committed = navigation.traverseTo(key).committed;
                    }
                    catch (error) {
                        if (error instanceof InvalidStateError && !PERSIST_ENTRIES) {
                            // ignore the error
                            return;
                        }
                        throw error;
                    }
                    if (PERSIST_ENTRIES || PERSIST_ENTRIES_STATE) {
                        committed
                            .then(entry => {
                            const historyState = getNavigationEntryWithMeta(navigation, entry, patchLimit);
                            replaceState(historyState, "", entry.url);
                        })
                            // Noop catch
                            .catch(() => { });
                    }
                });
                // window.addEventListener("hashchange", (ev) => {
                //   // TODO
                // })
            }
            if (INTERCEPT_EVENTS) {
                interceptWindowClicks(navigation, window);
            }
            if (PATCH_HISTORY) {
                patchGlobalScope(window, history, navigation);
            }
            if (!history.state) {
                // Initialise history state if not available
                const historyState = getNavigationEntryWithMeta(navigation, navigation.currentEntry, patchLimit);
                replaceState(historyState, "", navigation.currentEntry.url);
            }
        }
    };
}
function isAppNavigation(evt) {
    return evt.button === 0 &&
        !evt.defaultPrevented &&
        !evt.metaKey &&
        !evt.altKey &&
        !evt.ctrlKey &&
        !evt.shiftKey;
}
/** Checks if this element or any of its parents matches a given `selector` */
function matchesAncestor(givenElement, selector) {
    let element = getDefaultElement();
    // console.log({ element })
    while (element) {
        if (element.matches(selector)) {
            ok(element);
            return element;
        }
        element = element.parentElement ?? element.getRootNode()?.host;
    }
    return undefined;
    function getDefaultElement() {
        if (!givenElement)
            return undefined;
        if (givenElement.matches instanceof Function)
            return givenElement;
        return givenElement.parentElement;
    }
}
//# sourceMappingURL=get-polyfill.js.map