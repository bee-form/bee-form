
export const phone = {
    name: "phone",
    validate: (value) => {
        if (value == null || value === "") {
            return true;
        }

        const containsOnly = (str, sequence) => {
            for (let i = 0; i < str.length; i++) {
                const c = str[i];
                if (sequence.indexOf(c) === -1) {
                    return false;
                }
            }
            return true;
        };

        return containsOnly(value, "() -0123456789");
    },
};
