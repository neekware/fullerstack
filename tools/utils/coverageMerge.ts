/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as fs from 'fs';
import * as path from 'path';

import * as program from 'commander';

import { coverageDir, getGlobFiles } from './util';

/**
 * Runs a command, capture and return the output
 * @param script {string} an executable command
 */
async function combineLcovFiles(
  coverageGlobPattern: string,
  coverageComboFilePath: string
): Promise<void> {
  if (program.verbose) {
    console.log(coverageGlobPattern, coverageComboFilePath);
  }

  const lcovFiles = await getGlobFiles(coverageGlobPattern);
  if (!lcovFiles.length) {
    console.log('No lcov file found');
    return;
  }

  const mergedReport = lcovFiles.reduce(
    (mergedReport, currFile) => (mergedReport += fs.readFileSync(currFile)),
    ''
  );
  await fs.writeFile(path.resolve(coverageComboFilePath), mergedReport, (err) => {
    if (err) {
      throw err;
    }
  });
}

/**
 * Execute coverage merge command
 */
async function main() {
  const coverageGlobPattern = `${coverageDir}/**/lcov.info`;
  const coverageComboFilePath = `${coverageDir}/lcov.combo.info`;
  if (program.verbose) {
    console.log(coverageGlobPattern, coverageComboFilePath, coverageDir);
  }
  await combineLcovFiles(coverageGlobPattern, coverageComboFilePath);
}

program
  .version('0.0.1', '-v, --version')
  .option('--verbose', 'Runs the command in verbose mode')
  .parse(process.argv);

main();
