/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as program from 'commander';

import { execute, projDir } from './util';

const isDebug = false;
const tmpDir = `${projDir}/tmp`;
const gqlLib = `${projDir}/libs/ngx-gql/src/lib`;

const gqlPort = '4201';
const gqlEndpoint = `http://localhost:${gqlPort}/graphql`;
const gqlBlobPattern = `${gqlLib}/graphql/**/*.gql.ts`;
const gqlDocumentPath = `${tmpDir}/document-temp.json`;
const gqlSchemaPath = `${gqlLib}/gql.schema.ts`;
const gqlSchemaPathTemp = `${tmpDir}/schema-temp.ts`;
const apollo = `${projDir}/node_modules/.bin/apollo`;

console.log('Generate GraphQL config/schema files ...');

async function downloadSchemaDocument() {
  console.log('Download Schema Document ...');
  await execute(`mkdir -p ${tmpDir}`, isDebug);
  await execute(`rm -f ${gqlDocumentPath}`, isDebug);
  await execute(
    `${apollo} schema:download \
    --endpoint=${gqlEndpoint} \
    ${gqlDocumentPath}`,
    isDebug
  );
}

async function generateSchemaFile() {
  console.log('Generate Schema File ...');
  execute(`rm -f ${gqlSchemaPathTemp}`, isDebug);
  await execute(
    `${apollo} client:codegen ${gqlSchemaPathTemp} --localSchemaFile=${gqlDocumentPath} --includes="${gqlBlobPattern}" --target typescript --outputFlat `,
    isDebug
  );
}

async function saveSchemaFile() {
  await execute(`mv -f ${gqlSchemaPathTemp} ${gqlSchemaPath}`, isDebug);
  await execute(`rm -f ${gqlSchemaPathTemp}`, isDebug);
}

async function main() {
  await downloadSchemaDocument();
  await generateSchemaFile();
  await saveSchemaFile();
}

program.version('0.0.1', '-v, --version').parse(process.argv);

main().catch((err) => {
  console.error(`Error building GQL schema`, err);
  process.exit(111);
});
