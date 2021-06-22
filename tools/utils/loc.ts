/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as fs from 'fs';

import * as program from 'commander';
import * as replaceSection from 'markdown-replace-section';

import { execute, projPkgJson } from './util';

const DEBUG = false;

/**
 * Note, the "Lines of Code" seconds cannot be at the end
 * https://github.com/renke/markdown-replace-section/issues/1
 */
async function main() {
  const loc = await execute('loc .', !DEBUG);
  let readMe = fs.readFileSync('README.md', 'utf-8');

  readMe = replaceSection(readMe, 'Lines of Code', '```txt<br>' + loc + '```', false);

  fs.writeFileSync('README.md', readMe, 'utf-8');
}

program.version('0.0.1', '-v, --version').parse(process.argv);

main().catch((err) => {
  console.error(`Error updating Readme.md`, err);
  process.exit(111);
});
