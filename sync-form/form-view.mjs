import {isEmpty} from "../core/common/utils/objects";
import {ddStructure} from "../core/common/utils/dd-structure";
import {findNode} from "../core/common/utils/hiers";
import {setPath, getPathData} from "../core/form/arr-path";
import {parseValueNodes} from "../core/path-pattern/path-pattern";
import {getPathConfig} from "../core/form/config-reader";
import {normalizeFormConfig} from "./normalize-form-config";
import {validateForm} from "./validate";

export const createFormView = (data, onChange, rawFormConfig) => {
    const formConfig = normalizeFormConfig(rawFormConfig);
    const errorTree = validateForm(data, formConfig);

    const getView = (arrPath) => {
        const value = getPathData(data, arrPath);
        const pushValue = (newValue) => onChange(setPath(data, arrPath, newValue));

        const hasError = () => {
            return !isEmpty(getPathData(errorTree, arrPath));
        };
        return {
            value,
            pushValue,
            bind: () => ({
                onChange: (e) => pushValue(e.target.value),
                value: value || "",
                "data-path": arrPath.join("."),
            }),
            hasValidator: (name) => {
                const pathConfig = getPathConfig(formConfig, arrPath);
                return pathConfig && pathConfig.validators && pathConfig.validators.find((v) => v.name === name);
            },
            getError: () => {
                return getPathData(errorTree, [...arrPath, "$$"])
            },
            hasError,
            isValid: () => {
                return !hasError();
            },
            getErrorDomQuery: () => {
                const found = findNode(errorTree, ddStructure, (node, path) => node.$$ && path);
                return `[data-path='${found.join(".")}']`;
            },
            path: arrPath,
        };
    };

    return scoping((parentPath) => {
        return {
            ...getView(parentPath),
            withControl: (pathStr, apply) => {
                const arrPath = parseValueNodes(pathStr);

                return apply(getView([...parentPath, ...arrPath]));
            },
        };
    });
};

const scoping = (fn, path = []) => {
    return {
        ... fn(path),
        scope: (arrPath) => {
            return scoping(fn, [...path, ...arrPath])
        },
    };
};