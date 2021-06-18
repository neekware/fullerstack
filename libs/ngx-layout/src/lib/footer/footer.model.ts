/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export interface FooterLinks {
  name: string;
  link: string;
  icon?: string;
  external?: boolean;
}

export interface FooterItem {
  type: string;
  links: FooterLinks[];
}
