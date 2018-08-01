export const min = (minValue) => ({
    name: "min",
    validate: (v) => v == null || v >= minValue,
});