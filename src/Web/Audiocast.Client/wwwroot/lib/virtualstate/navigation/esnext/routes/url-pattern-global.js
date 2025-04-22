import "urlpattern-polyfill";
if (typeof URLPattern === "undefined") {
    throw new Error("urlpattern-polyfill did not import correctly");
}
export const globalURLPattern = URLPattern;
//# sourceMappingURL=url-pattern-global.js.map