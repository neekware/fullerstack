/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { RenderContext, renderTemplate } from './common.render';
import { getAsset } from './common.util';

export function getDefaultEmailTemplate(): string {
  return getAsset('i18n/email-template.html');
}

export function getEmailSubjectTemplate(action: string, locale: string): string {
  return getAsset(`i18n/${action}/${locale}/subject.md`);
}

export function getEmailBodyTemplate(action: string, locale: string): string {
  return getAsset(`i18n/${action}/${locale}/body.md`);
}

export function getEmailSubject(action: string, locale: string, context?: RenderContext): string {
  const subjectTemplate = getEmailSubjectTemplate(action, locale);
  if (subjectTemplate) {
    return renderTemplate(subjectTemplate, context);
  }
  return '';
}

export function getEmailBody(action: string, locale: string, context?: RenderContext): string {
  const bodyTemplate = getEmailBodyTemplate(action, locale);
  if (bodyTemplate) {
    const newContext = { ...context, html_content_v: renderTemplate(bodyTemplate, context) };
    const htmlTemplate = getDefaultEmailTemplate();
    const bodyHtml = renderTemplate(htmlTemplate, context);
    return bodyHtml;
  }
  return '';
}

export function getEmailBodySubject(
  action: string,
  locale: string,
  context?: RenderContext
): { Subject: string; HtmlBody: string } {
  return {
    Subject: getEmailSubject(action, locale, context),
    HtmlBody: getEmailBody(action, locale, context),
  };
}
