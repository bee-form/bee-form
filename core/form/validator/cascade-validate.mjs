import {changePath} from "../arr-path";
import {cascade} from "../../cascade/cascade";

export const cascadeValidate = (config, data, apply) => {
    let errors = {};
    for (let i = 0; i < config.length; i++) {
        const pathConfig = config[i];

        if ((pathConfig.condition && !pathConfig.condition(data)) || pathConfig.validators == null) {
            continue;
        }

        cascade(data, pathConfig.path).forEach(({value, path}) => {

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
    }

    return errors;
};

