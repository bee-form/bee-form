const rollup = require('rollup');

const {config} = require("./rollup-config");

async function build(options) {

    const {inputOptions, outputOptions} = config(options);

    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    // or write the bundle to disk
    await bundle.write(outputOptions);
}

const modules = [
    {
        folder: "react",
        name: "bee-form-react",
        index: "index.mjs",
    },
    {
        folder: "sync-form",
        name: "sync-form",
        index: "form-view.mjs",
    },
    {
        folder: "tunnels",
        name: "bee-form-tunnels",
        index: "index.mjs",
    },
    {
        folder: "validators",
        name: "bee-form-validators",
        index: "index.mjs",
    }
];

// noinspection JSIgnoredPromiseFromCall
modules.map(build);