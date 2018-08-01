function match(tPath, path) {
    if (tPath.length !== path.length) {
        return false;
    }
    for (let i = 0; i < tPath.length; i++) {
        const p1 = tPath[i];
        const p2 = path[i];

        if (p1.type === "wildcard") {
            continue;
        }
        if (p1.value !== p2) {
            return false;
        }
    }
    return true;
}

function combine(token, ret) {
    if (token.validators) {
        ret.validators = ret.validators ? ret.validators.concat(token.validators) : token.validators;
    }
    if (token.debounce) {
        ret.debounce = token.debounce;
    }
    if (token.tunnel) {
        ret.tunnel = token.tunnel;
    }
    if (token.faces) {
        ret.faces = token.faces;
    }
}

export function getPathConfig(config, path) {
    let ret = {};
    for (const token of config) {
        if (match(token.path, path)) {
            combine(token, ret);
        }
    }
    return ret;
}

