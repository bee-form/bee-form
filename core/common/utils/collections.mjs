export function removeMutate(col, e) {
    if (col === null) {
        return;
    }

    const i = col.indexOf(e);

    if (i === -1) {
        return;
    }

    col.splice(i, 1);
}

export function addRemove(col) {
    return (e) => {
        col.push(e);

        return () => removeMutate(col, e);
    };
}