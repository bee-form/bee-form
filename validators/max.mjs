export const max = (maxValue) => ({
    name: "max",
    validate: (v) => v == null || v <= maxValue,
});