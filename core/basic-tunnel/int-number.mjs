export const intNumber = {
    parse: (str) => {
        if (str == null || str.length === 0) {
            return null;
        } else {
            if (str.endsWith(".") || str === "-" || str === "+") {
                throw "NaN";
            }
            let mv = parseInt(str);
            if (isNaN(mv)) {
                throw "NaN";
            }
            return mv;
        }
    },
    format: (num) => num == null ? "" : "" + num,
};
