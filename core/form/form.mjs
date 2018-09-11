import {wrapField} from "./form-field";
import {tunnelFormat} from "./tunnel";
import {tunnelParse} from "./tunnel";
import {chain} from "../common/utils/fs";
import {calculateErrors} from "./errors/calculate-errors";
import {createEventBus} from "../event-bus/event-bus";
import {normalizeFormConfig} from "./normalize-form-config";

export function createForm(rawConfig, initData) {
    const config = normalizeFormConfig(rawConfig);
    rawConfig = null;

    const eventBus = _createEventBus(config, initData);
    initData = null;

    return {
        createView: () => {
            // Get Event Bus's current state, this Form View is associated with this state.
            const state = eventBus.getState();

            return {
                setTouched: (path, face = "") => {
                    let field = wrapField({path, face, config});
                    if (!field.isTouched(state)) {
                        eventBus.invoke(field.setTouched());
                    }
                },
                isTouched: (path, face = "") => {
                    let field = wrapField({path, face, config});
                    return field.isTouched(state) || field.isDirty(state);
                },
                isDirty: (path, face = "") => {
                    let field = wrapField({path, face, config});
                    return field.isDirty(state);
                },
                getError: (path, face = "") => {
                    let field = wrapField({path, face, config});

                    if (field.hasDebounceVv(state)) {
                        return {name: "@debounce"};
                    }
                    if (field.hasParseError(state)) {
                        return {name: "@parse"};
                    }
                    return field.getError(state);
                },
                hasError: (path) => {
                    let field = wrapField({path, config});
                    return field.hasError(state);
                },
                getValue: (path, face = "") => {
                    let field = wrapField({path, face, config});

                    const debounceVv = field.getDebounceVv(state);
                    if (debounceVv != null) {
                        return debounceVv;
                    }

                    const parseErrorVv = field.getParseError(state);
                    if (parseErrorVv != null) {
                        return parseErrorVv;
                    }

                    const parseSuccessVv = field.getParseSuccessVvo(state);
                    if (parseSuccessVv != null) {
                        return parseSuccessVv;
                    }

                    let mv = field.getData(state);

                    const tunnel = field.getTunnelConfig();
                    if (tunnel) {
                        return tunnelFormat(mv, tunnel, state.data, path);
                    }

                    return mv;
                },
                onChange: (vv, path, face = "") => {
                    let field = wrapField({path, face, config});

                    const debounce = field.getDebounceConfig();

                    if (debounce) {
                        eventBus.invoke(field.setDebounceVv(vv));

                        // Debounce event
                        const currentMv = field.getData(state);
                        eventBus.addEvent({
                            init: timeoutResolve(debounce, chain(
                                field.clearDebounceVv(),
                                setViewValue(field, currentMv, state.data)(vv)
                            )),
                            deprecated: (state) => {
                                return field.getDebounceVv(state) !== vv ||
                                    field.getData(state) !== currentMv
                                    ;
                            },
                        });
                    } else {
                        eventBus.invoke(setViewValue(field, field.getData(state), state.data)(vv));
                    }
                },
                flush: (path, face = "") => {
                    let field = wrapField({path, face, config});

                    let reducers = [field.clearParseSuccessVvo()];

                    const debounceVv = field.getDebounceVv(state);

                    if (debounceVv != null) {
                        reducers = [...reducers,
                            field.clearDebounceVv(),
                            setViewValue(field, field.getData(state), state.data)(debounceVv)
                        ];
                        // eventBus.invoke(chain(
                        //     field.clearDebounceVv(),
                        //     setViewValue(field, field.getData(state))(debounceVv)
                        // ));
                    }
                    eventBus.invoke(chain(...reducers));
                },
            };
        },
        getData: () => eventBus.getState().data,
        getState: () => eventBus.getState(),
        setData: (newData) => eventBus.invoke((state) => Object.assign({}, state, {
            data: newData,
            "parse_errors_vvo": null,
            "parse_success_vvo": null,
            "debounce_vvo": null,
            "errors_override": null,
        })),
        onChange: eventBus.onChange,
    };
}




const setViewValue = (field, currentMv, data) => {

    const wrapStateReducer = (reducer) => (state) => {
        if (!field.isDirty(state)) {
            return reducer(field.setDirty()(state));
        }
        return reducer(state);
    };

    const tunnel = field.getTunnelConfig();

    if (tunnel) {
        return (vv) => {
            try {
                return wrapStateReducer(
                    chain(
                        field.setData(
                            tunnelParse(vv, tunnel, currentMv, data, field.path)
                        ),
                        field.setParseSuccessVvo(vv),
                    )
                );
            } catch (e) {
                return wrapStateReducer(
                    field.setParseError(vv),
                );
            }
        };
    } else {
        return (vv) => wrapStateReducer(
            field.setData(vv),
        );
    }
};

const timeoutResolve = (debounce, reduce) => (resolve) => {
    let timeout = setTimeout(() => {
        resolve(reduce);
    }, debounce);

    return () => clearTimeout(timeout);
};

const _createEventBus = (config, initData) => {
    let {errors, errors_override, events,} = calculateErrors(config, {data: initData});

    const eventBus = createEventBus(
        {data: initData, errors, errors_override},
        events,
        {
            afterReduce: (state) => {
                const {errors, errors_override, events,} = calculateErrors(config, state);

                events.forEach(eventBus.addEvent);

                return Object.assign({}, state, {
                    errors,
                    errors_override,
                });
            },
        }
    );
    errors_override = null;
    events = null;
    return eventBus;
};