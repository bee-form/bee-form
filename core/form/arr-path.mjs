
export function getPathData(obj, path) {
    if (path == null) {
        return obj;
    }
    for (const v of path) {
        if (obj == null) {
            return obj;
        }
        obj = obj[v];
    }
    return obj;
}

export function setPath(object, path, value) {
    if (path.length === 0) {
        return value;
    }

    const attr = path[0];
    const lastAttrs = path.slice(1);

    if (
        Array.isArray(object) ||
        (object == null && ((typeof attr === "number") || (attr.length && !isNaN(attr))))
    ) {
        let clone = object ? object.slice(0) : [];
        clone[attr] = setPath(object && object[attr], lastAttrs, value);
        return clone;
    } else {
        return Object.assign({}, object, {[attr]: setPath(object && object[attr], lastAttrs, value)});
    }
}

export function changePath(object, path, fn) {
    let oldValue = getPathData(object, path);
    let updatedValue = fn(oldValue);
    return updatedValue !== oldValue ? setPath(object, path, updatedValue) : object;
}
