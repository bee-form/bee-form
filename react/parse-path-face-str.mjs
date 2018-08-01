import {parseValueNodes} from "../core/path-pattern/path-pattern";

export function parsePathFaceStr(pathFaceStr) {
    if (pathFaceStr == null || pathFaceStr.length === 0) {
        return {path: []};
    }

    const [pathStr, face] = pathFaceStr.split("!");

    return {path: parseValueNodes(pathStr), face};
}
