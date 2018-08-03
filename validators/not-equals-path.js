import {getPathData} from "../core/form/arr-path";
import {parseValueNodes} from "../core/path-pattern/path-pattern";

export const notEqualsPath = (path) => {
    let p = parseValueNodes(path);
    return ({
        name: "not-equals-path",
        validate: (v, data) => getPathData(data, p) !== v,
        path,
    });
};
