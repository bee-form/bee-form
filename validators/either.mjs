export const either = (...values) => ({
    name: "either",
    validate: (value) => {
        if (value == null || value === "") {
            return true;
        }
        return values.indexOf(value) > -1;
    },
});