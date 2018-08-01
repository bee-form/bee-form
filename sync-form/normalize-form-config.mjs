import {oMapToArr} from "../core/common/utils/objects";
import {parseNodes} from "../core/path-pattern/path-pattern";

const normalizeFieldsConfig = (fieldsConfig) => {
    return oMapToArr(fieldsConfig, (v, pathStr) => {
        return Object.assign(
            {path: parseNodes(pathStr),},
            normalizeFieldRules(v),
        );
    });
};

export const normalizeFormConfig = (formConfig) => {
    if (!Array.isArray(formConfig)) {
        return normalizeFieldsConfig(formConfig);
    }
    return formConfig.reduce((total, formConfigItem) => total.concat(
        Array.isArray(formConfigItem) ?
            formConfigItem.map(({path, ...others}) => ({path: path.map((pathNode) => ({type: "string", value: pathNode})), ...others})) :
            normalizeFieldsConfig(formConfigItem)
    ), []);
};

function normalizeFieldRules(v) {
    return {validators: v,};
}
