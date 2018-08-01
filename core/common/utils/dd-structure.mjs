export const ddStructure = {

    findChild: (children, fn) => {
        for (const k in children) {
            if (k !== "$$") {
                const result = fn(children[k], k);
                if (result) {
                    return result;
                }
            }
        }
    },

    forEachChild: (children, fn) => {
        for (const k in children) {
            if (k !== "$$") {
                fn(children[k], k);
            }
        }
    },
    getChildren: (node) => node,
    copyAttrs: (targetNode, srcNode) => {
        if (srcNode.hasOwnProperty("$$")) {
            targetNode["$$"] = srcNode["$$"];
        }
    },
    isEmptyChildren: (children) => {
        for (const k in children) {
            if (k !== "$$") {
                return false;
            }
        }
        return true;
    },
};