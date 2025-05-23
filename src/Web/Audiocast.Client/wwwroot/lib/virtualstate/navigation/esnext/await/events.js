import { createNavigationEvent } from "./create-promise.js";
export const navigate = createNavigationEvent("navigate");
export const navigateError = createNavigationEvent("navigateerror");
export const error = navigateError;
export const navigateSuccess = createNavigationEvent("navigatesuccess");
export const success = navigateSuccess;
export const currentEntryChange = createNavigationEvent("currententrychange");
export const entriesChange = createNavigationEvent("entrieschange");
//# sourceMappingURL=events.js.map