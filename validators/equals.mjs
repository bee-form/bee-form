
export const equals = (value) => ({
    name: "equals",
    validate: (v) => v === value,
    value,
});