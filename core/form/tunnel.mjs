export const tunnelParse = (vv, tunnel, currentData, data, path) => {
    for (const passage of tunnel) {
        if (passage.parse) {
            vv = passage.parse(vv, currentData, data, path);
        }
    }
    return vv;
};

export const tunnelFormat = (mv, tunnel, currentData, path) => {
    for (let i = tunnel.length - 1; i > -1; i--) {
        const passage = tunnel[i];

        if (passage.format) {
            mv = passage.format(mv, currentData, path);
        }
    }
    return mv;
};
