import {oMapToArr} from "../common/utils/objects";
import {parseNodes} from "../path-pattern/path-pattern";

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
        Array.isArray(formConfigItem) ? formConfigItem : normalizeFieldsConfig(formConfigItem)
    ), []);
};

function normalizeFieldRules(v) {
    if (Array.isArray(v)) {
        return {validators: v,};
    } else {
        const ret = {};
        for (const k in v) {
            if (k.startsWith("!")) {
                if (ret.faces === undefined) {
                    ret.faces = {};
                }

                ret.faces[k.substring(1)] = normalizeFaceConfig(v[k]);
            } else if (k === "v") {
                ret.validators = v[k];
            } else {
                ret[k] = v[k];
            }
        }
        return ret;
    }
}

export const normalizeFaceConfig = (fc) => {
    if (Array.isArray(fc)) {
        return {tunnel: fc,};
    } else {
        return fc;
    }
};


