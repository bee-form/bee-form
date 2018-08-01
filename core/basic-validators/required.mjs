
export const required = {
    name: "required",
    validate: (value) => value != null && value !== "",
};