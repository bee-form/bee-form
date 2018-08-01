import {cascade} from "../core/cascade/cascade";

export const cascadeApply = (config, data, apply) => {
    for (let i = 0; i < config.length; i++) {
        const pathConfig = config[i];

        if ((pathConfig.condition && !pathConfig.condition(data)) || pathConfig.validators == null) {
            continue;
        }

        cascade(data, pathConfig.path).forEach(({value, path}) => {
            apply(value, path, pathConfig, i);
        });
    }
};
