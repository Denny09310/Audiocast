const isWebCryptoSupported = "crypto" in globalThis && typeof globalThis.crypto.randomUUID === "function";
export const v4 = isWebCryptoSupported
    ? globalThis.crypto.randomUUID.bind(globalThis.crypto)
    : () => Array.from({ length: 5 }, () => `${Math.random()}`.replace(/^0\./, ""))
        .join("-")
        .replace(".", "");
//# sourceMappingURL=uuid-or-random.js.map