
export function chain() {
    return (value) => {
        for (let i = 0; i < arguments.length; i++) {
            const fn = arguments[i];

            value = fn(value);
        }
        return value;
    };
}