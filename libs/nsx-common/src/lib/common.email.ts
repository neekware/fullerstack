/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as showdown from 'showdown';

import { RenderContext, renderTemplate } from './common.render';
import { getAsset } from './common.util';

const showdownConverter = new showdown.Converter({ underline: true });

export function getDefaultEmailTemplate(): string {
  return getAsset('i18n/email-template.html');
}

export function getEmailSubjectTemplate(action: string, locale: string): string {
  return getAsset(`i18n/${action}/${locale}/subject.md`);
}

export function getEmailBodyTemplate(action: string, locale: string): string {
  const mdFile = getAsset(`i18n/${action}/${locale}/body.md`, { stripNl: false });
  const htmlFile = showdownConverter.makeHtml(mdFile);
  return htmlFile;
}

export function getEmailSubject(action: string, locale: string, context?: RenderContext): string {
  const subjectTemplate = getEmailSubjectTemplate(action, locale);
  if (subjectTemplate) {
    return renderTemplate(subjectTemplate, context);
  }
  return '';
}

export function getHtmlEmailBody(action: string, locale: string, context?: RenderContext): string {
  const bodyTemplate = getEmailBodyTemplate(action, locale);
  const defaultHtmlTemplate = getDefaultEmailTemplate();
  const htmlTemplate = renderTemplate(defaultHtmlTemplate, { html_content_v: bodyTemplate });
  const bodyHtml = renderTemplate(htmlTemplate, context);
  return bodyHtml;
}

export function getEmailBodySubject(
  action: string,
  locale: string,
  context?: RenderContext
): { Subject: string; HtmlBody: string } {
  return {
    Subject: getEmailSubject(action, locale, context),
    HtmlBody: getHtmlEmailBody(action, locale, context),
  };
}
