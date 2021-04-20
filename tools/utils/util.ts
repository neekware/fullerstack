import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

export const projName = 'fullerstack';
export const projDir = path.resolve(__dirname, '../..');
export const coverageDir = path.resolve(path.join(projDir, 'coverage'));
export const distDir = path.resolve(path.join(projDir, 'dist'));
export const projPkgJson = require(path.join(projDir, 'package.json'));

/**
 * Runs a command, capture and return the output
 * @param script {string} an executable command
 */
export function execute(script: string): Promise<any> {
  return new Promise((resolvePromise, rejectPromise) => {
    childProcess.exec(
      script,
      { maxBuffer: 1024 * 1000 },
      (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          rejectPromise(stderr);
        } else {
          resolvePromise(stdout);
        }
      }
    );
  });
}

/**
 * Checks if a file exists
 * @param filePath path to file
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

/**
 * Returns a list of file name
 * @param globPattern pattern for globs
 */
export function getGlobFiles(globPattern): Promise<string[]> {
  // /**/error.log, /**/results.txt, ...etc
  return new Promise((resolve, reject) => {
    glob(globPattern, (error, result) => {
      if (error) {
        console.log(error);
        resolve([]);
      }
      resolve(result);
    });
  });
}
