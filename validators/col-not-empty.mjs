export const colNotEmpty = {
    name: "col-not-empty",
    validate: (value) => {
        return !!value && !!value.length;
    },
};