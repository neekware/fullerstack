/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  constructor(readonly registry: MatIconRegistry, readonly sanitizer: DomSanitizer) {}

  /**
   * Loads icons with namespace
   * @param iconList list of icons
   */
  registerSvgIconsInNamespace(iconList, cacheBustingHash = null) {
    // [
    //   ...
    //   {
    //     names: ['ca', 'CA'],
    //     namespace: 'flags',
    //     path: 'assets/images/svg/flags/ca.svg'
    //   },
    // ]

    iconList.forEach((icon) => {
      const path = cacheBustingHash ? `${icon.path}?${cacheBustingHash}` : icon.path;
      const securePath = this.sanitizer.bypassSecurityTrustResourceUrl(path);
      icon.names.forEach((name) => {
        this.registry.addSvgIconInNamespace(icon.namespace, name, securePath);
      });
    });
  }

  /**
   * Loads icons set with no namespace
   * @param iconPath path to icon set (ex: '/assets/fonts/mdi.svg')
   */
  registerSvgIconSet(iconPath: string, cacheBustingHash = null) {
    iconPath = cacheBustingHash ? `${iconPath}?${cacheBustingHash}` : iconPath;
    const securePath = this.sanitizer.bypassSecurityTrustResourceUrl(iconPath);
    this.registry.addSvgIconSet(securePath);
  }

  /**
   * Register font alias
   * @param font, alias (ex: 'fontawesome', 'fa')
   */
  registerFontClassAlias(font: string, alias: string) {
    this.registry.registerFontClassAlias(font, alias);
  }
}
