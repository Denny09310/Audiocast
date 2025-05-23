import { isURLPatternPlainPathname, isURLPatternStringPlain, URLPattern } from "./url-pattern.js";
import { like } from "../is.js";
import { transitionEvent } from "./transition.js";
const Routes = Symbol.for("@virtualstate/navigation/routes/routes");
const Attached = Symbol.for("@virtualstate/navigation/routes/attached");
const Detach = Symbol.for("@virtualstate/navigation/routes/detach");
const Target = Symbol.for("@virtualstate/navigation/routes/target");
const TargetType = Symbol.for("@virtualstate/navigation/routes/target/type");
/**
 * @internal
 */
export function getRouterRoutes(router) {
    return router[Routes];
}
export function isRouter(value) {
    function isRouterLike(value) {
        return !!value;
    }
    return isRouterLike(value) && !!value[Routes];
}
function getPatternString(pattern) {
    if (!pattern)
        return undefined;
    if (typeof pattern === "string") {
        if (isURLPatternStringPlain(pattern)) {
            return pattern;
        }
        else {
            return undefined;
        }
    }
    if (isURLPatternPlainPathname(pattern)) {
        return pattern.pathname;
    }
    return undefined;
}
function getPattern(pattern) {
    if (!pattern)
        return undefined;
    if (typeof pattern !== "string") {
        return pattern;
    }
    return new URLPattern({ pathname: pattern });
}
export class Router {
    [Routes] = {
        router: [],
        route: [],
        reject: [],
        resolve: [],
    };
    [Attached] = new Set();
    [Target];
    [TargetType];
    listening = false;
    constructor(target, type) {
        this[Target] = target;
        this[TargetType] = type;
        // Catch use override types with
        // arrow functions so need to bind manually
        this.routes = this.routes.bind(this);
        this.route = this.route.bind(this);
        this.then = this.then.bind(this);
        this.catch = this.catch.bind(this);
    }
    routes(...args) {
        let router, pattern;
        if (args.length === 1) {
            [router] = args;
        }
        else if (args.length === 2) {
            [pattern, router] = args;
        }
        if (router[Attached].has(this)) {
            throw new Error("Router already attached");
        }
        this[Routes].router.push({
            string: getPatternString(pattern),
            pattern: getPattern(pattern),
            router,
        });
        router[Attached].add(this);
        this.#init();
        return this;
    }
    then(...args) {
        if (args.length === 1) {
            const [fn] = args;
            this[Routes].resolve.push({
                fn,
            });
        }
        else if (args.length === 2 && isThenError(args)) {
            const [fn, errorFn] = args;
            this[Routes].resolve.push({
                fn,
            });
            this[Routes].reject.push({
                fn: errorFn,
            });
        }
        else {
            const [pattern, fn, errorFn] = args;
            this[Routes].resolve.push({
                string: getPatternString(pattern),
                pattern: getPattern(pattern),
                fn,
            });
            if (errorFn) {
                this[Routes].reject.push({
                    string: getPatternString(pattern),
                    pattern: getPattern(pattern),
                    fn: errorFn
                });
            }
        }
        // No init for just then
        return this;
        function isThenError(args) {
            const [left, right] = args;
            return typeof left === "function" && typeof right === "function";
        }
    }
    catch(...args) {
        if (args.length === 1) {
            const [fn] = args;
            this[Routes].reject.push({
                fn,
            });
        }
        else {
            const [pattern, fn] = args;
            this[Routes].reject.push({
                string: getPatternString(pattern),
                pattern: getPattern(pattern),
                fn,
            });
        }
        // No init for just catch
        return this;
    }
    route(...args) {
        if (args.length === 1) {
            const [fn] = args;
            this[Routes].route.push({
                fn,
            });
        }
        else {
            const [pattern, fn] = args;
            this[Routes].route.push({
                string: getPatternString(pattern),
                pattern: getPattern(pattern),
                fn,
            });
        }
        this.#init();
        return this;
    }
    [Detach](router) {
        const index = this[Routes].router.findIndex((route) => route.router === router);
        if (index > -1) {
            this[Routes].router.splice(index, 1);
        }
        const length = Object.values(this[Routes]).reduce((sum, routes) => sum + routes.length, 0);
        if (length === 0) {
            this.#deinit();
        }
    }
    detach = () => {
        if (this.listening) {
            this.#deinit();
        }
        for (const attached of this[Attached]) {
            if (isRouter(attached)) {
                attached[Detach](this);
            }
        }
        this[Attached] = new Set();
    };
    #init = () => {
        if (this.listening) {
            return;
        }
        const target = this[Target];
        if (!target)
            return;
        this.listening = true;
        if (typeof target === "function") {
            return target(this.#event);
        }
        const type = this[TargetType] ?? "navigate";
        target.addEventListener(type, this.#event);
    };
    #deinit = () => {
        if (!this.listening) {
            return;
        }
        const target = this[Target];
        if (!target)
            return;
        if (typeof target === "function") {
            throw new Error("Cannot stop listening");
        }
        this.listening = false;
        const type = this[TargetType] ?? "navigate";
        target.removeEventListener(type, this.#event);
    };
    #event = (event) => {
        if (!event.canIntercept)
            return;
        if (isIntercept(event)) {
            event.intercept({
                handler: () => {
                    return this.#transition(event);
                }
            });
        }
        else if (isTransitionWhile(event)) {
            event.transitionWhile(this.#transition(event));
        }
        else if (isWaitUntil(event)) {
            event.waitUntil(this.#transition(event));
        }
        else if (isRespondWith(event)) {
            event.respondWith(this.#transition(event));
        }
        else {
            return this.#transition(event);
        }
        function isIntercept(event) {
            return (like(event) &&
                typeof event.intercept === "function");
        }
        function isTransitionWhile(event) {
            return (like(event) &&
                typeof event.transitionWhile === "function");
        }
        function isRespondWith(event) {
            return (like(event) &&
                typeof event.respondWith === "function");
        }
        function isWaitUntil(event) {
            return (like(event) &&
                typeof event.waitUntil === "function");
        }
    };
    #transition = async (event) => {
        return transitionEvent(this, event);
    };
}
//# sourceMappingURL=router.js.map