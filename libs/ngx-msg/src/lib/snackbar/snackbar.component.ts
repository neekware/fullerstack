/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DeepReadonly } from 'ts-essentials';

import { SnackbarData, SnackbarDataDefault, SnackbarType } from './snackbar.model';

@Component({
  selector: 'fullerstack-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  data: DeepReadonly<SnackbarData> = SnackbarDataDefault;

  constructor(@Inject(MAT_SNACK_BAR_DATA) readonly info: SnackbarData) {
    this.data = { ...this.data, ...info };
    switch (this.data.msgType) {
      case SnackbarType.error:
        this.data = {
          ...this.data,
          iconColor: 'red',
          svgIcon: 'close-circle-outline',
        };
        break;
      case SnackbarType.warn:
        this.data = {
          ...this.data,
          iconColor: 'orange',
          svgIcon: 'alert-circle-outline',
        };
        break;
      case SnackbarType.success:
        this.data = {
          ...this.data,
          iconColor: 'lime',
          svgIcon: 'check-circle-outline',
        };
        break;
    }
  }
}
