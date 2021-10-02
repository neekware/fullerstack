/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import './menu.scss';

import { Component } from 'react';

/* eslint-disable-next-line */
export interface MenuProps {}

export class Menu extends Component<MenuProps> {
  render() {
    return (
      <div>
        <p>Welcome to Menu!</p>
      </div>
    );
  }
}

export default Menu;
