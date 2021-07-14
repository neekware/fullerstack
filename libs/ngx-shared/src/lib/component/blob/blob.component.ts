/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fullerstack-blob',
  templateUrl: './blob.component.html',
  styleUrls: ['./blob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlobComponent {
  @Input()
  text = null;
  @Input()
  textColor = null;
  @Input()
  icon = null;
  @Input()
  iconColor = null;
  isMainColor = true;

  constructor() {
    this.isMainColor = ['primary', 'accent', 'warn'].some((value) => value === this.iconColor);
  }
}
