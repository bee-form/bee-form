const modules = require("./modules").modules;
const spawn = require('child_process').spawn;

(async () => {
    await Promise.all(modules.map((module) => cmd("npm publish", {cwd: `${__dirname}/../${module.folder}`})));
})();


function cmd(cmd, options = {
    stdio: "inherit",
    // stdio: "ignore"
}) {

    return new Promise((resolve, reject) => {
        let split = cmd.split(" ");

        const spawnOptions = !/^win/.test(process.platform) ? [split[0], split.slice(1), options] : ['cmd', ['/s', "/c", ...split], options];

        let p = spawn(...spawnOptions);
        p.on("close", (a, b) => {
            // console.log(a, b)
            resolve();
        });
    });
}
