export const humanName = {
    name: "humanName",
    validate: (value) => {
        if (value == null || value === "") {
            return true;
        }

        const containsAny = (str, sequence) => {
            for (let i = 0; i < sequence.length; i++) {
                const c = sequence[i];
                if (str.indexOf(c) > -1) {
                    return true;
                }
            }
            return false;
        };

        return !containsAny(value, ",/?;:'\"`[{]}=+-_)(*&^%$#@!~<>") && !/[0-9]/.test(value);
    },
};