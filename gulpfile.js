const gulp = require("gulp");
const { exec } = require("child_process");

let HELPERS = {
    execute: command => {
        const process = exec(command);
        process.stdout.on("data", data => {
            console.log(data.toString());
        });
        process.stderr.on("data", data => {
            console.log(data.toString());
        });
        process.on("exit", code => {
            console.log("Process exited with code " + code.toString());
            exec("mv compile.js dist.js");
        });
        return process;
    }
};

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

gulp.task("ts", function (done) {
    return HELPERS.execute("rollup -c");

    done();
});

gulp.task(
    "default",
    gulp.series("ts", function (done) {
        gulp.watch(
            "./src/**/*.ts",
            { ignoreInitial: true, usePolling: true },
            debounce(gulp.series("ts"), 2000)
        );
    })
);
