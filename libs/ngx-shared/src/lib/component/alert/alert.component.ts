/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { I18nService } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'fullerstack-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() color = 'primary';
  @Input() text = '';

  constructor(readonly i18n: I18nService) {}
}
