/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export const getHostHref = (location: Location): string => {
  const proto = location.protocol || 'http';
  const port = location.port ? ':' + location.port : '';
  const path = `${proto}//${location.hostname}${port}`;
  return path;
};

export const tokenizeFullName = (fullName: string) => {
  const tokenizedName = {
    firstName: '',
    lastName: '',
  };

  if (fullName.match(/^(.*\s+.*)+$/)) {
    const parts = fullName.replace(/\s\s+/g, ' ').split(' ');
    tokenizedName.firstName = parts[0];
    tokenizedName.lastName = parts.slice(1, parts.length).join(' ');
  }
  return tokenizedName;
};

export const isExpired = (date: Date) => {
  const now = Date.now();
  const expiry = new Date(date).getTime();
  return expiry < now;
};
