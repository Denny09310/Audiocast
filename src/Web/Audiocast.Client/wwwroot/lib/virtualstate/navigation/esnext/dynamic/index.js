import { Navigation, } from "../navigation.js";
import { like, ok } from "../is.js";
function getHost(options) {
    if (options.baseURL) {
        return new URL(options.baseURL).host;
    }
    if (options.hosts) {
        const hosts = Object.keys(options.hosts);
        if (hosts.includes("localhost")) {
            return "localhost";
        }
        if (hosts.length) {
            return hosts[0];
        }
    }
    return undefined;
}
function isMaybeExtension(string) {
    return /\.[a-z]+$/.test(string);
}
function extensionName(string) {
    if (!isMaybeExtension(string)) {
        return "";
    }
    const split = string.split(".");
    return `.${split.at(-1)}`;
}
function directoryName(string) {
    const split = string.split("/");
    split.pop();
    return `${split.join("/")}/`;
}
function getBaseURL(options) {
    const url = get();
    const instance = new URL(url);
    let extension = ".js";
    if (isMaybeExtension(url)) {
        extension = extensionName(instance.pathname);
        instance.pathname = directoryName(instance.pathname);
    }
    if (typeof options.extension === "string") {
        extension = options.extension;
    }
    return {
        baseURL: instance.toString(),
        extension
    };
    function get() {
        if (options.baseURL) {
            return options.baseURL;
        }
        const host = getHost(options);
        if (host)
            return `file://${host}`;
        try {
            if (typeof window !== "undefined") {
                if (typeof window.location !== "undefined") {
                    return window.location.origin;
                }
            }
        }
        catch { }
        throw new Error("Could not resolve base URL");
    }
}
export class DynamicNavigation extends Navigation {
    modules;
    options;
    baseURL;
    extension;
    constructor(options) {
        const { baseURL, extension } = getBaseURL(options);
        super({
            baseURL
        });
        this.modules = {};
        this.baseURL = baseURL;
        this.extension = extension;
        this.options = options;
        this.addEventListener("navigate", this.onNavigate);
        this.addEventListener("navigateerror", console.error);
    }
    onNavigate = (event) => {
        // TODO implement cross origin runtime navigation
        ok(event.destination.sameDocument, "Must be sameDocument navigation");
        event.intercept({
            commit: "after-transition",
            handler: () => this.intercept(event)
        });
    };
    async intercept(event) {
        const dynamic = await this.getModule(event.destination.url);
        event.commit();
        if (isHandler(dynamic)) {
            await dynamic.intercept(event, this);
        }
        function isHandler(value) {
            return (like(value) &&
                typeof value.intercept === "function");
        }
    }
    async getModule(url) {
        const instance = new URL(url, this.baseURL);
        const string = instance.toString();
        const existing = this.modules[string];
        if (existing) {
            return existing;
        }
        const hostPath = this.options.hosts?.[instance.host];
        if (hostPath) {
            instance.pathname = `${hostPath.replace(/\/$/, "")}/${instance.pathname}`;
            instance.host = "";
        }
        if (!isMaybeExtension(instance.pathname)) {
            if (instance.pathname.endsWith("/")) {
                instance.pathname = `${instance.pathname}index${this.extension}`;
            }
            else {
                instance.pathname = `${instance.pathname}${this.extension}`;
            }
        }
        const dynamic = await import(instance.toString());
        this.modules[string] = dynamic;
        return dynamic;
    }
}
//# sourceMappingURL=index.js.map