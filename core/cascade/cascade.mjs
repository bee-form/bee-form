
function hasWildcard(nodes) {
    return !!nodes.find((n) => n.type === "wildcard");
}

function toAttr(node) {
    return (node.type === "string" ? node.value : +node.value);
}

function indices(length) {
    let r = [];
    for (let i = 0; i < length; i++) {
        r.push(i);
    }
    return r;
}

export const cascade = (object, nodes) => {
    if (nodes.length === 0) {
        return [{value: object, path: []}];
    }

    const node = nodes[0];
    const lastNodes = nodes.slice(1);

    if (node.type === "wildcard") {
        let attrs = Array.isArray(object) ? indices(object.length) : Object.keys(object);
        if (attrs.length === 0) {
            return [];
        }

        return attrs.reduce((t, attr) => {
            const child = object[attr];

            return t.concat(cascade(child, lastNodes).map(({path, value}) => ({value, path: [attr].concat(path)})));
        }, []);

    } else {
        const attr = toAttr(node);
        const child = object == null ? null : object[attr];

        if (child == null) {
            if (hasWildcard(lastNodes)) {
                return [];
            } else {
                return [{path: [attr].concat(lastNodes.map(toAttr)), value: undefined}];
            }
        }

        return cascade(child, lastNodes).map(({path, value}) => ({value, path: [attr].concat(path)}));
    }


};