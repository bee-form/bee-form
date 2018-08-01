import {changePath, getPathData} from "../arr-path";
import {cascadeValidate} from "../validator/cascade-validate";

function wrapEo(dataPath, configIndex, validatorIndex) {
    return {
        setValue: (value) => (errors_override) => changePath(errors_override, dataPath.concat(["$$"]), (eoList) =>
            (eoList || [])
                .filter((eo) => !(eo.validatorIndex === validatorIndex && eo.configIndex === configIndex))
                .concat({
                    validatorIndex,
                    configIndex,
                    result: value,
                })
        ),
        getValue: (errors_override) => {
            const errorOverride = getPathData(errors_override, dataPath);
            if (errorOverride == null || errorOverride.$$ == null) {
                return undefined;
            }

            let eo = errorOverride.$$.find((eo) => eo.validatorIndex === validatorIndex && eo.configIndex === configIndex);
            if (eo) {
                return eo.result;
            } else {
                return undefined;
            }
        },
    };
}

export const calculateErrors = (config, state) => {

    const events = [];

    let errors_override = state.errors_override;

    const errors = cascadeValidate(
        config.map(({path, condition, validators})=> ({path, condition, validators})),
        state.data,
        (value, dataPath, validators, configIndex) => {

            for (let i = 0; i < validators.length; i++) {
                const validator = validators[i];

                const eoInvoke = wrapEo(dataPath, configIndex, i);

                let eo = eoInvoke.getValue(errors_override);
                let status = eo !== undefined ? eo : validator.validate(value, state.data, dataPath);

                if (status !== true) {
                    if (status === false) {
                        return {
                            error: validator,
                        };
                    } else if (status.then) {
                        errors_override = eoInvoke.setValue("requesting")(errors_override);
                        events.push({
                            description: `Async validate [${dataPath}]: ${value}`,
                            init: (resolve) => {
                                status.then((result) => resolve((state) =>
                                    changePath(state, ["errors_override"], eoInvoke.setValue(result))
                                ));
                            },
                            deprecated: (state) => getPathData(state.data, dataPath) !== value,
                        });
                        return {
                            error: validator,
                            status: "requesting",
                        };
                    } else {
                        // requesting
                        return {
                            error: validator,
                            status,
                        };
                    }
                }
            }
            return undefined;
        },
    );

    return {
        errors,
        errors_override,
        events,
    };
};

