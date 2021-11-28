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
import * as ld from 'lodash';
import * as semver from 'semver';

import { distDir, execute, libDir, projPkgJson } from './util';

/**
 * Returns the path to library's package.json
 * @param moduleBuildPath build path for a given library
 * @returns
 */
function getModulePackagePath(moduleBuildPath: string): string {
  const modulePkgPath = path.join(moduleBuildPath, 'package.json');
  return modulePkgPath;
}

/**
 * Given a lib it returns its packages.json data
 * @param moduleBuildPath path to build directory of a given lib
 * @returns
 */
function getModulePackage(moduleBuildPath: string): any {
  const modulePkgPath = getModulePackagePath(moduleBuildPath);
  const modulePkg = require(modulePkgPath);
  return modulePkg;
}

/**
 * Hydrate lib's package.json with that of the workspace
 */
async function syncPackageData(moduleBuildPath: string): Promise<void> {
  let modulePkg = await getModulePackage(moduleBuildPath);

  // get in the following info from workspace package.json if library doesn't provide them
  const precedenceInfo = [
    'author',
    'license',
    'homepage',
    'repository',
    'contributors',
    'bugs',
    'keywords',
    'contributors',
  ];

  // overwrite the following props from the workspace package.json
  const overwriteInfo = precedenceInfo.filter((prop) => !modulePkg.hasOwnProperty(prop));

  // update common attributes
  const parentInfo = ld.pick(projPkgJson, overwriteInfo);

  modulePkg = { ...modulePkg, ...parentInfo };

  // flush new files to build dir of each package
  const modulePkgPath = getModulePackagePath(moduleBuildPath);
  await fs.writeFile(modulePkgPath, JSON.stringify(modulePkg, null, 2), () => {
    console.error(`Prepared library's package.json  ...`);
  });
}

/**
 * Builds a production build of a given library with its deps, from the current branch
 * @returns build status
 */
async function buildPackage(isNg: boolean) {
  if (program.build) {
    let cmd = `yarn nx build ${program.library} --with-deps --skip-nx-cache`;
    if (isNg) {
      cmd = `${cmd} --prod`;
    }

    console.log(cmd);

    await execute(cmd).catch((error) => {
      console.log(`Failed to build ${program.library} ... ${error}`);
      return false;
    });
  }
  return true;
}

/**
 * Returns semVer version of a given library
 * @returns semVer string version of development branch
 */
async function getVersion(moduleBuildPath: string, isDev = false) {
  const modulePkg = await getModulePackage(moduleBuildPath);

  const version: semver.SemVer = semver.parse(modulePkg.version);
  const semVer = `${version.major}.${version.minor}.${version.patch}`;
  if (!isDev) {
    return semVer;
  }

  const lastCommit = await execute('git rev-parse HEAD');
  const commitHash = lastCommit.toString().trim().slice(0, 10);

  // 1.0.0 to become 1.0.0+dev.commitHash
  const devVersion = `${semVer}-dev-${commitHash}`;
  return devVersion;
}
/**
 * Releases a given branch by building, pushing it to npmjs.org
 * @returns process status code
 */
async function main() {
  if (!program.library) {
    console.log('Error: Library name is required.');
    console.log(program.helpInformation());
    return 1;
  }

  const moduleSrcPath = path.join(libDir, program.library);
  const moduleBuildPath = path.join(distDir, 'libs', program.library);
  const isNg = fs.existsSync(path.join(moduleSrcPath, 'ng-package.json'));

  const built = await buildPackage(isNg);
  if (!built) {
    return 1;
  }

  await syncPackageData(moduleBuildPath);

  const modulePkg = getModulePackage(moduleBuildPath);
  const publishOptions = `--access public --non-interactive --no-git-tag-version `;
  const newVersion = await getVersion(moduleBuildPath, program.dev);
  const releaseTag = `--tag ${program.dev ? 'dev' : 'latest'}`;
  let publishCmd = `yarn publish ${publishOptions} --new-version ${newVersion} ${releaseTag}`;

  if (program.publish) {
    console.log('Publishing new version', newVersion);
    console.log(publishCmd);
    await execute(`cd ${moduleBuildPath} && ${publishCmd}`).catch((error) => {
      console.log(`Failed to publish package. ${error}`);
    });

    if (!program.dev) {
      console.log('You probably want to also tag the version now:');
      console.log(` git tag -a ${newVersion} -m 'version ${newVersion}' && git push --tags`);
    }
  }
}

program
  .version('0.0.1', '-v, --version')
  .option('-l, --library <library>', 'Library name to push to npmjs.org')
  .option('-b, --build', 'Build the library')
  .option('-p, --publish', 'Publish @<lib>@latest')
  .option('-d, --dev', 'Publish @<lib>@next')
  .parse(process.argv);

main().catch((err) => {
  console.error(`Error releasing`, err);
  process.exit(1);
});
