/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as program from 'commander';

import { execute, projPkgJson } from './util';

const depSkip = ['@angular', '@nrwl', 'rxjs'];
const devDepSkip = ['@angular', '@nrwl', 'typescript'];

const DEBUG = false;

/**
 * Update packages
 */
async function update2Latest(pkgName: string, devDep = true) {
  const pkgMgr = program.manager || 'yarn';
  let cmd = `yarn add ${pkgName}`;
  let devFlag = '-D';
  if (pkgMgr === 'npm') {
    cmd = `npm install ${pkgName}`;
    devFlag = '--save-dev';
  }

  if (devDep) {
    cmd = `${cmd} ${devFlag}`;
  }

  console.log(`Updating ${pkgName} ...`);
  await execute(cmd, !DEBUG);
}

async function updateDependencies() {
  if (projPkgJson.hasOwnProperty('dependencies')) {
    const updateList = Object.keys(projPkgJson.dependencies).filter(
      (key) => !depSkip.some((name) => key.startsWith(name))
    );

    await update2Latest(updateList.join(' '), false);
  }
}

async function updateDevDependencies() {
  if (projPkgJson.hasOwnProperty('devDependencies')) {
    const updateList = Object.keys(projPkgJson.dependencies).filter(
      (key) => !devDepSkip.some((name) => key.startsWith(name))
    );
    await update2Latest(updateList.join(' '), false);
  }
}

async function main() {
  await updateDependencies();
  await updateDevDependencies();
}

program
  .version('0.0.1', '-v, --version')
  .option('-m', '--manager <manager>', 'Package manager, [yarn | npm] (default: yarn)')
  .parse(process.argv);

main().catch((err) => {
  console.error(`Error updating package.json`, err);
  process.exit(111);
});
