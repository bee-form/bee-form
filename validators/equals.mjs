
export const equals = (value) => ({
    name: "equals",
    validate: (v) => v == null || v === "" || v === value,
    value,
});