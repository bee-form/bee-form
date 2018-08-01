import {parsePathFaceStr} from "./parse-path-face-str";

export const reactBindings = ({getValue, onChange, flush, setTouched}) => ({
    bind: (pathFaceStr) => {
        const {path, face} = parsePathFaceStr(pathFaceStr);
        return {
            value: getValue(path, face) || "",
            onChange: (e) => onChange(e.target.value, path, face),
            onBlur: () => flush(path, face),
            onFocus: () => setTouched(path, face),
        };
    },
    bindRadio: (pathFaceStr, tv) => {
        if (tv === undefined) {
            tv = pathFaceStr;
            pathFaceStr = undefined;
        }

        const {path, face} = parsePathFaceStr(pathFaceStr);

        return {
            value: tv,
            checked: getValue(path, face) === tv,
            onClick: () => onChange(tv, path, face),
        };
    },
    bindCheckboxes: (pathFaceStr, tv) => {
        if (tv === undefined) {
            tv = pathFaceStr;
            pathFaceStr = undefined;
        }

        const {path, face} = parsePathFaceStr(pathFaceStr);
        const value = getValue(path, face);
        return {
            value: tv,
            checked: !!value && value.indexOf(tv) > -1,
            onClick: () => {
                onChange(value && value.indexOf(tv) > -1 ? value.filter((v) => v !== tv) : (value || []).concat([tv]), path, face);
            },
        };
    },
    bindCheckbox: (pathFaceStr) => {
        const {path, face} = parsePathFaceStr(pathFaceStr);
        const value = getValue(path, face);
        return {
            checked: !!value,
            onClick: () => {
                onChange(!value, path, face);
            },
        };
    },
    bindMultipleSelect: (pathFaceStr) => {
        const {path, face} = parsePathFaceStr(pathFaceStr);
        const value = getValue(path, face);
        return {
            value: value || [],
            onChange: (e) => {
                const options = e.target.options;
                const newValues = [];
                for (let i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                        newValues.push(options[i].value);
                    }
                }
                onChange(newValues, path, face);
            },
        };
    },
});
