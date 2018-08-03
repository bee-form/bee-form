const {modules} = require("./modules");
const rollup = require('rollup');

const {config} = require("./rollup-config");

async function watch(options) {

    const {inputOptions, outputOptions} = config(options);

    const watcher = await rollup.watch({
        ...inputOptions,
        output: outputOptions,
    });

    watcher.on('event', event => {
        console.log(event.code);
    });
}

// noinspection JSIgnoredPromiseFromCall
modules.map(watch);