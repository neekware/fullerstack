/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { readFile, writeFile } from 'fs';
import * as path from 'path';

import { sync } from 'glob';

import { projDir } from './util';

export const I18nDefaultLanguage = 'en';
export const I18nActiveLanguages = ['en', 'de', 'fr', 'es', 'he', 'fa', 'zh-hans'];

export const I18nDirectory = path.join(projDir, 'libs/agx-assets/src/lib/i18n/client');
export const I18nFilePattern = path.join(I18nDirectory, '**/*.json');

const translate = require('google-translate-api');

interface I18nLanguageIsoPath {
  iso: string;
  path: string;
}

// google translate iso map
export function mapIso(iso: string) {
  const mappedIso = {
    he: 'iw',
  };

  return mappedIso[iso] || iso;
}

/**
 * Reaches out to google and translate text
 * @param fromFile - full path to 'from' language json file
 * @param toFile - full path to 'to' language json file
 */
async function processLanguageFileTranslation(fromFile, toFile) {
  const fromData = require(fromFile.path);
  const toData = require(toFile.path);
  const toNewData = {};
  for (const key in fromData) {
    const fromValue = fromData[key];
    const toValue = toData[key];

    if (fromValue?.length > 0 && toValue.length < 1) {
      const resp = await translate(fromData[key], {
        from: I18nDefaultLanguage,
        to: mapIso(toFile.iso),
      });
      if (resp?.text?.length > 0) {
        toNewData[key] = resp.text;
      }
    }
  }

  const content = JSON.stringify(toNewData, null, 2);
  writeFile(toFile, content, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function getFromLanguageFile(): I18nLanguageIsoPath {
  const filePath = path.join(I18nDirectory, `${I18nDefaultLanguage}.json`);
  return { iso: I18nDefaultLanguage, path: filePath };
}

function getToLanguageFiles(): I18nLanguageIsoPath[] {
  const translationFiles = sync(I18nFilePattern);
  const toLanguageFile: I18nLanguageIsoPath[] = [];

  for (const filePath of translationFiles) {
    for (const iso of I18nActiveLanguages) {
      if (iso !== I18nDefaultLanguage && filePath.endsWith(`${iso}.json`)) {
        toLanguageFile.push({ iso, path: filePath });
      }
    }
  }
  return toLanguageFile;
}

/**
 *  Translate files
 */
async function main(argv) {
  console.log('Processing translations (via google) ...');

  const fromFileInfo = getFromLanguageFile();
  const toFilesInfo = getToLanguageFiles();
  console.log(
    `Translating: from (${I18nDefaultLanguage}) => to: (${I18nActiveLanguages.filter(
      (iso) => iso !== I18nDefaultLanguage
    )})`
  );

  for (const toInfo of toFilesInfo) {
    await processLanguageFileTranslation(fromFileInfo, toInfo);
  }
}

main(process.argv).catch((err) => {
  console.error(`Error translating languages`, err);
  process.exit(111);
});
