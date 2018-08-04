
export const maxLength = (length) => ({
    name: "max-length",
    validate: (v) => v == null || v.length <= length,
    length,
});
