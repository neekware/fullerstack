import * as fs from 'fs';
import * as ld from 'lodash';
import * as path from 'path';
import * as program from 'commander';
import * as semver from 'semver';
import { distDir, execute, projPkgJson } from './utils';

const moduleBuildPath = path.join(distDir, 'libs', program.lib);
const modulePkgPath = require(path.join(moduleBuildPath, 'package.json'));
const publishOptions = `--access public --non-interactive --no-git-tag-version `;

/**
 * Hydrate lib's package.json with that of the workspace
 */
async function syncPackageData() {
  let modulePkg = require(modulePkgPath);

  // update common attributes
  const parentInfo = ld.pick(projPkgJson, [
    'author',
    'version',
    'license',
    'homepage',
    'repository',
    'contributors',
    'keywords',
    'bugs',
  ]);

  modulePkg = { ...modulePkg, ...parentInfo };
  // flush new files to build dir of each package
  await fs.writeFile(modulePkgPath, JSON.stringify(modulePkg, null, 2), () => {
    console.error(`Flushed package.json  ...`);
  });

  await fs.writeFileSync(
    path.join(moduleBuildPath, './README.md'),
    fs.readFileSync('./README.md')
  );
}

async function buildPackage() {
  if (program.build) {
    const cmd = `yarn build`;
    console.log(cmd);
    await execute(cmd).catch((error) => {
      console.log(`Failed to build ${program.lib} ... ${error}`);
      return false;
    });
  }
  return true;
}

async function getDevVersion() {
  const lastCommit = await execute('git rev-parse HEAD');
  const commitHash = lastCommit.toString().trim().slice(0, 10);

  // 1.0.0 to become 1.0.0+dev.commitHash
  const version: semver.SemVer = semver.parse(projPkgJson.version);
  const semVer = `${version.major}.${version.minor}.${version.patch}`;
  const devVersion = `${semVer}-dev-${commitHash}`;
  return devVersion;
}

async function main() {
  const built = await buildPackage();
  if (!built) {
    return 1;
  }

  await syncPackageData();

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
  .option('-n', '--lib <lib>', 'Library name to push to npmjs.org')
  .option('-b, --build', 'Build the lib')
  .option('-p, --publish', 'Publish @<lib-name>@latest')
  .option('-d, --dev', 'Publish @<lib-name>@next')
  .parse(process.argv);

main();
