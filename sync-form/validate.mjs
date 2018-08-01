import {changePath} from "../core/form/arr-path";
import {cascadeApply} from "./cascade-apply-config";

export const validateForm = (data, formConfig) => {
    const apply = (value, path, validators, i) =>
        validators && validators.find(({validate}) => !validate(value, data));

    let errors = {};

    cascadeApply(formConfig, data, (value, path, pathConfig, i) => {
        errors = changePath(errors, path.concat(["$$"]), (oError) => {
            if (oError && oError.error) {
                return oError;
            }

            let error = apply(value, path, pathConfig.validators, i);
            if (error) {
                return error;
            }
        });
    });

    return errors;
};

