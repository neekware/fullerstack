/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { MenuItem } from './menu.model';

export class MenuNode implements MenuItem {
  name: string = null;
  icon: string = null;
  link: string = null;
  target = null;
  external = false;
  fullspan = false;
  fullscreen = false;
  headless = false;
  allowed = true;
  disabled = false;
  permissions: string[] = [];

  parent: MenuNode = null;
  children: MenuNode[] = [];

  level = 0;

  constructor(params: MenuItem) {
    for (const attr in params) {
      if (attr !== 'children') {
        if (Object.prototype.hasOwnProperty.call(params, attr)) {
          if (Object.prototype.hasOwnProperty.call(this, attr)) {
            this[attr] = params[attr];
          }
        }
      }
    }
  }

  /**
   * @returns true if node is a `link` type
   */
  get isLink(): boolean {
    if (this.link && this.link.length) {
      return true;
    }
    return false;
  }

  /**
   * @returns true if node is not a link
   */
  get isNode(): boolean {
    return !this.isLink;
  }

  /**
   * @returns true if node has children
   */
  get hasChildren(): boolean {
    return this.children.length !== 0;
  }

  /**
   * @returns true if node is external link (ex: 'www.youtube.com')
   */
  get isExternalLink(): boolean {
    return this.isLink && this.external;
  }

  /**
   * @returns true if node is internal link (ex: '/auth/login')
   */
  get isInternalLink(): boolean {
    return this.isLink && !this.external;
  }

  /**
   * @returns true if node is link that hinds the menu on click
   */
  get isFullSpan(): boolean {
    return this.isLink && this.fullspan;
  }

  /**
   * @returns true if node is a link that requires the header/footer to be hidden
   */
  get isFullScreen(): boolean {
    return this.isLink && this.fullscreen;
  }

  /**
   * @returns true if node is a link that requires the header/footer to be hidden
   */
  get isHeadless(): boolean {
    return this.isLink && this.headless;
  }

  /**
   * Calculates offsets for each node for use in padding and margins
   * @param value numeric value for calculating an offset
   * @param unit string type of the offset unit (ex: 'px', 'rem')
   */
  offset(value: number, unit = 'px') {
    return `${this.level * value}${unit}`;
  }

  /**
   * @param url current route url
   * @returns true if node or any of its children are active
   */
  isActive(url: string) {
    if (this.link === url) {
      return true;
    }
    for (const child of this.children) {
      if (child.isActive(url)) {
        return true;
      }
    }
    return false;
  }
}
