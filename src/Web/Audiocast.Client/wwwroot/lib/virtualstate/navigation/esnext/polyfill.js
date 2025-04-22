import { getNavigation } from "./get-navigation.js";
import { applyPolyfill, shouldApplyPolyfill } from "./apply-polyfill.js";
import { setSerializer } from "./util/serialization.js";
import { setIgnoreWarnings, setTraceWarnings } from "./util/warnings.js";
const navigation = getNavigation();
if (shouldApplyPolyfill(navigation)) {
    try {
        applyPolyfill({
            navigation
        });
    }
    catch (error) {
        console.error("Failed to apply polyfill");
        console.error(error);
    }
}
export { setSerializer, setIgnoreWarnings, setTraceWarnings };
//# sourceMappingURL=polyfill.js.map