import * as fs from 'fs';
import * as ld from 'lodash';
import * as path from 'path';
import * as program from 'commander';
import * as semver from 'semver';
import { distDir, execute, projPkgJson } from './utils';

/**
 * Hydrate lib's package.json with that of the workspace
 */
async function syncPackageData(moduleBuildPath: string) {
  const modulePkgPath = path.join(moduleBuildPath, 'package.json');
  let modulePkg = require(modulePkgPath);

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
  const overwriteInfo = precedenceInfo.filter((prop) => !modulePkg[prop]);

  // update common attributes
  const parentInfo = ld.pick(projPkgJson, overwriteInfo);

  modulePkg = { ...modulePkg, ...parentInfo };

  // flush new files to build dir of each package
  await fs.writeFile(modulePkgPath, JSON.stringify(modulePkg, null, 2), () => {
    console.error(`Prepared library's package.json  ...`);
  });
}

/**
 * Builds a production build of a given library with its deps, from the current branch
 * @returns build status
 */
async function buildPackage() {
  if (program.build) {
    const cmd = `yarn build ${program.library} --with-deps --skip-nx-cache --prod`;
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
async function getDevVersion() {
  const lastCommit = await execute('git rev-parse HEAD');
  const commitHash = lastCommit.toString().trim().slice(0, 10);

  // 1.0.0 to become 1.0.0+dev.commitHash
  const version: semver.SemVer = semver.parse(projPkgJson.version);
  const semVer = `${version.major}.${version.minor}.${version.patch}`;
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

  const built = await buildPackage();
  if (!built) {
    return 1;
  }

  const moduleBuildPath = path.join(distDir, 'libs', program.library);
  await syncPackageData(moduleBuildPath);

  const publishOptions = `--access public --non-interactive --no-git-tag-version `;
  let newVersion = projPkgJson.version;
  let publishCmd = `yarn publish ${publishOptions} --new-version ${newVersion} --tag latest`;
  if (program.dev) {
    newVersion = await getDevVersion();
    publishCmd = `yarn publish ${publishOptions} --new-version ${newVersion} --tag dev`;
  }

  if (program.publish) {
    console.log('Publishing new version', newVersion);
    console.log(publishCmd);
    await execute(`cd ${moduleBuildPath} && ${publishCmd}`).catch((error) => {
      console.log(`Failed to publish package. ${error}`);
    });

    if (!program.dev) {
      console.log('You probably want to also tag the version now:');
      console.log(
        ` git tag -a ${newVersion} -m 'version ${newVersion}' && git push --tags`
      );
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

main();
