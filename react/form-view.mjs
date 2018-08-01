import {parsePathFaceStr} from "./parse-path-face-str";
import {parseValueNodes} from "../core/path-pattern/path-pattern";

function joinArr(arr1, arr2) {
    if (arr2 == null) {
        return arr1;
    }
    return arr1.concat(arr2);
}

export function createView({getError, hasError, getValue, isTouched, isDirty, onChange, flush, setTouched}, extras) {
    const scope = (path, face) => {
        const scope0 = (method) => (childPath, cFace) => method(joinArr(path, childPath), cFace === undefined ? face : cFace);
        const scope1 = (method) => (vv, childPath, cFace) => method(vv, joinArr(path, childPath), cFace === undefined ? face : cFace);

        return createView({
            getValue        : scope0(getValue),
            getError        : scope0(getError),
            hasError        : scope0(hasError),
            flush: scope0(flush),
            setTouched      : scope0(setTouched),

            onChange        : scope1(onChange),
        }, extras);
    };

    return Object.assign(
        {
            isPristine: (pathFaceStr) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);
                return !isTouched(path, face);
            },
            isDirty: (pathFaceStr) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);
                return isDirty(path, face);
            },
            hasError: (pathStr) => hasError(parseValueNodes(pathStr)),
            getError: (pathFaceStr) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);
                return getError(path, face);
            },

            getValue: (pathFaceStr) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);
                return getValue(path, face);
            },
            pushValue: (vv, pathFaceStr) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);
                return onChange(vv, path, face);
            },
            changeValue: (fn, pathFaceStr) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);

                return onChange(fn(getValue(path, face)), path, face);
            },

            scope: (pathFaceStr) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);

                return scope(path, face);
            },

            // Convenient methods
            getData: () => getValue([]),
            isValid: () => !hasError(),
            map: (pathStr, fn) => {
                const path = parseValueNodes(pathStr);

                let pathData = getValue(path);
                if (pathData == null || pathData.length === 0) {
                    return [];
                }

                return pathData.map((e, i) =>
                    fn(scope((path||[]).concat([i])), i)
                );
            },

            withControl: (pathFaceStr, fn) => {
                const {path, face} = parsePathFaceStr(pathFaceStr);

                return fn(scope(path, face));
            },
            withError: (pathFaceStr, fn) => {
                if (fn === undefined) {
                    fn = pathFaceStr;
                    pathFaceStr = undefined;
                }
                const {path, face} = parsePathFaceStr(pathFaceStr);

                let error = getError(path, face);

                if (error == null) {
                    return null;
                }
                return fn(error);
            },
        },
        extras({getValue, onChange, flush, setTouched, })
    );
}