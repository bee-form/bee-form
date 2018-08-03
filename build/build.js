const {modules} = require("./modules");
const rollup = require('rollup');

const {config} = require("./rollup-config");

async function build(options) {

    const {inputOptions, outputOptions} = config(options);

    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    // or write the bundle to disk
    await bundle.write(outputOptions);
}

// noinspection JSIgnoredPromiseFromCall
modules.map(build);