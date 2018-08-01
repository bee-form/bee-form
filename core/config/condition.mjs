import {normalizeFormConfig} from "../form/normalize-form-config";

export const condition = (condition, fieldsConfig) =>
    normalizeFormConfig(fieldsConfig).map(
        (fieldConfig) => Object.assign({}, fieldConfig, {condition: condition})
    )
;