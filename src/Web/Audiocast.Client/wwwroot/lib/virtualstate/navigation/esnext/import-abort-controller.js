import { GlobalAbortController } from "./global-abort-controller.js";
if (!GlobalAbortController) {
    throw new Error("AbortController expected to be available or polyfilled");
}
export const AbortController = GlobalAbortController;
//# sourceMappingURL=import-abort-controller.js.map