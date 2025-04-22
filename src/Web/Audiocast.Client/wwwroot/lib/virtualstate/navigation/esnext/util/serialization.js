let GLOBAL_SERIALIZER = JSON;
export function setSerializer(serializer) {
    GLOBAL_SERIALIZER = serializer;
}
export function stringify(value) {
    return GLOBAL_SERIALIZER.stringify(value);
}
export function parse(value) {
    return GLOBAL_SERIALIZER.parse(value);
}
//# sourceMappingURL=serialization.js.map