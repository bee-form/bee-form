export function omit(o, attrs) {
    let ret = {};
    for (const k in o) {
        if (attrs.indexOf(k) === -1) {
            ret[k] = o[k];
        }
    }
    return ret;
}

export function isEmpty(o) {
    if (o == null) {
        return true;
    }
    if (typeof o !== "object") {
        return false;
    }
    for (const k in o) {
        return false;
    }
    return true;
}

export function oMapToArr(o, fn) {
    let ret = [];
    for (const k in o) {
        ret.push(fn(o[k], k));
    }
    return ret;
}
