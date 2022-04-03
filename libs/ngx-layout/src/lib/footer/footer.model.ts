/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
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
