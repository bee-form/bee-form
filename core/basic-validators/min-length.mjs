export const minLength = (length) => ({
    name: "min-length",
    validate: (v) => v == null || v.length >= length,
    length,
});