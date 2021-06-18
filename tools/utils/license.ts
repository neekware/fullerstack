/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { readFile, writeFile } from 'fs';

import * as program from 'commander';
import { Glob } from 'glob';

const licenseContent = `/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

`;

const licensableFiles = ['./apps/**/*.ts', './libs/**/*.ts', './tools/**/*.ts'];
const fileSkipList = [
  'index.ts',
  'test-setup.ts',
  'mock.ts',
  'polyfills.ts',
  'main.ts',
  'gql.schema.ts',
];

console.log('Applying license headers ...');

async function main() {
  licensableFiles.forEach((pattern) => {
    new Glob(pattern, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach((file) => {
        readFile(file, 'utf-8', (err, content) => {
          if (err) {
            throw err;
          }

          if (program.verbose) {
            console.log(`processing ... ${file}`);
          }

          if (fileSkipList.some((skipFile) => file.endsWith(skipFile))) {
            if (program.verbose) {
              console.log(`skipping ... ${file}`);
            }
          } else if (
            !content.startsWith(licenseContent) &&
            !content.startsWith(licenseContent.trim())
          ) {
            if (content.includes(licenseContent)) {
              console.log(`License found, but not on top, skipping it ... ${file}`);
            } else {
              console.log(`License inserted ... ${file}`);
              writeFile(file, licenseContent + content, (err) => {
                if (err) {
                  throw err;
                }
              });
            }
          }
        });
      });
    });
  });
}

program.version('0.0.1', '-v, --version').option('--verbose', 'Verbose').parse(process.argv);

main().catch((err) => {
  console.error(`Error releasing`, err);
  process.exit(1);
});
