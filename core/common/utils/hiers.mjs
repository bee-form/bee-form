
export const eachNode = (obj, structure, fn) => {
    fn(obj, []);

    let children = structure.getChildren(obj);
    if (children) {
        structure.forEachChild(children, (child, key) => eachNode(child, structure, (obj, path) => fn(obj, [key].concat(path))));
    }
};

export const purge = (obj, structure, fn) => {
    let ret = Array.isArray(obj) ? [] : {};
    structure.copyAttrs(ret, obj);

    let hasChild = false;
    structure.forEachChild(structure.getChildren(obj), (child, key) => {
        const emptyChild = purge(child, structure, fn);
        if (!structure.isEmptyChildren(structure.getChildren(emptyChild)) || !fn(emptyChild)) {
            ret[key] = emptyChild;

            hasChild = true;
        }
    });

    if (hasChild || !fn(ret)) {
        return ret;
    } else {
        return undefined;
    }
};


export const findNode = (obj, structure, fn) => {
    const thisFound = fn(obj, []);
    if (thisFound) {
        return thisFound;
    }

    let children = structure.getChildren(obj);
    if (children) {
        const found = structure.findChild(
            children,
            (child, key) => findNode(child, structure, (obj, path) => fn(obj, [key].concat(path)))
        );
        if (found) {
            return found;
        }
    }
};
