/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

import { ButtonType } from '../../annotator.model';
import { AnnotatorService } from '../../annotator.service';

@Component({
  selector: 'fullerstack-hide-menu',
  templateUrl: './hide.component.html',
  styleUrls: ['./hide.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class HideMenuComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(readonly annotation: AnnotatorService) {}

  toggleButtonVisibility(event: Event, buttonType: ButtonType) {
    event.stopPropagation();
    this.annotation.setState({
      buttonVisibility: {
        ...this.annotation.state.buttonVisibility,
        [buttonType]: !this.annotation.state.buttonVisibility[buttonType],
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
