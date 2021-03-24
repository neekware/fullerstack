"use strict";
exports.__esModule = true;
exports.getGlobFiles = exports.fileExists = exports.execute = exports.distDir = exports.coverageDir = exports.projPkgJson = exports.projDir = exports.projName = void 0;
var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
exports.projName = 'fullerstack';
exports.projDir = path.resolve(__dirname, '../..');
exports.projPkgJson = require(path.join(exports.projDir, 'package.json'));
exports.coverageDir = require(path.join(exports.projDir, 'coverage'));
exports.distDir = require(path.join(exports.projDir, 'dist'));
/**
 * Runs a command, capture and return the output
 * @param script {string} an executable command
 */
function execute(script) {
    return new Promise(function (resolvePromise, rejectPromise) {
        childProcess.exec(script, { maxBuffer: 1024 * 1000 }, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                rejectPromise(stderr);
            }
            else {
                resolvePromise(stdout);
            }
        });
    });
}
exports.execute = execute;
/**
 * Checks if a file exists
 * @param filePath path to file
 */
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        return false;
    }
}
exports.fileExists = fileExists;
/**
 * Returns a list of file name
 * @param globPattern pattern for globs
 */
function getGlobFiles(globPattern) {
    // /**/error.log, /**/results.txt, ...etc
    return new Promise(function (resolve, reject) {
        glob(globPattern, function (error, result) {
            if (error) {
                console.log(error);
                resolve([]);
            }
            resolve(result);
        });
    });
}
exports.getGlobFiles = getGlobFiles;
