export const either = (values) => ({
    name: "either",
    validate: (value) => {
        return values.indexOf(value) > -1;
    },
});