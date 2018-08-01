export const json = {
    parse: (str) => str == null || str.length === 0 ? null : JSON.parse(str),
    format: (obj) => obj == null ? "" : JSON.stringify(obj),
};
