const gulp = require("gulp");
const { exec } = require('child_process');

let HELPERS = {
    execute: (command) => {
        const process = exec(command);
        process.stdout.on('data', (data) => { console.log(data.toString()); })
        process.stderr.on('data', (data) => { console.log(data.toString()); })
        process.on('exit', (code) => {
            console.log('Process exited with code ' + code.toString());
        })
        return process;
    }
}

gulp.task("js", function (done) {
    return HELPERS.execute('rollup -c');

    done();
});

gulp.task("default", gulp.series("js", function (done) {
    gulp.watch(
        "./src/**/*.js",
        { ignoreInitial: false, usePolling: true },
        gulp.series("js")
    );
}));