export const tunnelParse = (vv, currentData, tunnel) => {
    for (const passage of tunnel) {
        if (passage.parse) {
            vv = passage.parse(vv, currentData);
        }
    }
    return vv;
};

export const tunnelFormat = (vv, tunnel) => {
    for (const passage of tunnel) {
        if (passage.format) {
            vv = passage.format(vv);
        }
    }
    return vv;
};
