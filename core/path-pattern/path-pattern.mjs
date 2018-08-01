function consumeLiteral(s) {
    if (s[0] === "*") {
        return {
            type: "wildcard",
            length: 1,
            value: s[0],
        };
    } else if (!isNaN(s[0])) {
        let value = /^\d+/.exec(s)[0];
        return {
            type: "number",
            value,
            length: value.length,
        };
    } else {
        throw 53262323;
    }
    // let end = path.indexOf("]", 1);
    // let value = path.substring(1, end);
    //
    // // noinspection JSCheckFunctionSignatures
    // return {
    //     length: end+1,
    //     value,
    //     type: isNaN(value) ? "wildcard" : "number",
    // };
}

function consumeNode(path) {
    // if (path.length === 0) {
    //     return null;
    // }

    if (path[0] === ".") {
        let c2 = consumeNode(path.substring(1));
        return Object.assign({}, c2, {
            length: c2.length +1
        });
    }

    if (path[0] === "[") {
        let cl = consumeLiteral(path.substring(1));
        if (path[cl.length + 1] !== "]") {
            throw "']' expected";
        }

        return Object.assign({}, cl, {
            length: cl.length + 2,
        });
    } else if (/^\w/.test(path)) {
        let value = /^[\w-]+/.exec(path)[0];
        return {
            type: "string",
            value,
            length: value.length,
        };
    } else {
        console.log(path);
        throw 8293801;
    }
}

export const parseNodes = (path) => {
    let nodes = [];
    for (;path && path.length;) {

        let node = consumeNode(path);

        nodes.push(node);

        path = path.substring(node.length);
    }
    return nodes;
};


export const parseValueNodes = (str) => parseNodes(str).map((node) => (node.type === "string" ? node.value : +node.value));