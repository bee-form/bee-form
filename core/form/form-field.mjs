import {isEmpty} from "../common/utils/objects";
import {ddStructure} from "../common/utils/dd-structure";
import {purge} from "../common/utils/hiers";
import {chain} from "../common/utils/fs";
import {omit} from "../common/utils/objects";
import {getPathConfig} from "./config-reader";
import {setPath, changePath, getPathData} from "./arr-path";

function getFaceConfig(name, pathConfig, face) {
    const value = getPathData(pathConfig, ["faces", face, name]);
    if (value === undefined) {
        return pathConfig[name];
    }
    return value;
}

const deletePath = (path) => (type) => (state) => {
    if (state[type] == null) {
        return state;
    }

    const start = path.slice(0, path.length - 1);
    const last = path[path.length - 1];

    const attr = purge(
        changePath(state[type], start, (o) => omit(o, [last])),
        ddStructure, (o) => o == null || isEmpty(o.$$)
    );

    return setPath(state, [type], attr);
};


export const wrapField = ({path, face, config}) => {
    const deleteFace = deletePath((path || []).concat(["$$", face]));
    const delete$$ = deletePath((path || []).concat(["$$"]));
    const clearPath = deletePath(path);

    const getFace = (type) => (state) => getPathData(state[type], path.concat(["$$", face]));
    const get$$ = (type) => (state) => getPathData(state[type], path.concat(["$$"]));

    const setFace = (type, value) => (state) => setPath(state, [type].concat(path).concat(["$$", face]), value);

    return {
        getDebounceVv   : getFace("debounce_vvo"),
        setDebounceVv   : (vv) => setFace("debounce_vvo", vv),
        clearDebounceVv : () => deleteFace("debounce_vvo"),
        clearParseSuccessVvo : () => deleteFace("parse_success_vvo"),
        hasDebounceVv   : (state) => {
            return face ?
                getFace("debounce_vvo")(state) !== undefined :
                !isEmpty(get$$("debounce_vvo")(state));
        },

        getParseError     : getFace("parse_errors_vvo"),
        getParseSuccessVvo: getFace("parse_success_vvo"),

        hasParseError   : (state) => face ?
            getFace("parse_errors_vvo")(state) !== undefined :
            !isEmpty(get$$("parse_errors_vvo")(state)),

        getError        : (state) =>
            getPathData(state.errors, path.concat(["$$", "error"])),

        hasError        : (state) =>
            !isEmpty(getPathData(state.errors, path)) ||
            !isEmpty(getPathData(state.debounce_vvo, path)) ||
            !isEmpty(getPathData(state.parse_errors_vvo, path))
        ,

        getData         : (state) => getPathData(state.data, path),
        setData         : (mv) => chain(
            delete$$("parse_success_vvo"),
            delete$$("parse_errors_vvo"),
            delete$$("debounce_vvo"),
            delete$$("errors_override"),
            (state) => setPath(state, ["data"].concat(path), mv),
        ),

        setParseError   : (value) => chain(
            deleteFace("debounce_vvo"),
            setFace("parse_errors_vvo", value),
        ),

        setParseSuccessVvo   : (value) => chain(
            setFace("parse_success_vvo", value),
        ),

        isTouched : getFace("field_toucheds"),
        setTouched : () => setFace("field_toucheds", true),
        clearTouched : () => clearPath("field_toucheds"),

        isDirty : getFace("field_dirties"),
        setDirty : () => setFace("field_dirties", true),

        getTunnelConfig     : () => getFaceConfig("tunnel", getPathConfig(config, path), face),
        getDebounceConfig   : () => getFaceConfig("debounce", getPathConfig(config, path), face),
        path,
    };
};

