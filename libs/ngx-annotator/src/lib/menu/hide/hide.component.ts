/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

import { ButtonType } from '../../annotator.model';
import { AnnotatorService } from '../../annotator.service';

interface ActionButton {
  type: ButtonType;
  icon: string;
  label: string;
}

@Component({
  selector: 'fullerstack-hide-menu',
  templateUrl: './hide.component.html',
  styleUrls: ['./hide.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class HideMenuComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  actionButtons: ActionButton[] = [
    {
      type: 'trash',
      icon: 'trash-can-outline',
      label: _('COMMON.TRASH'),
    },
    {
      type: 'undo',
      icon: 'undo',
      label: _('COMMON.UNDO'),
    },
    {
      type: 'redo',
      icon: 'redo',
      label: _('COMMON.REDO'),
    },
    {
      type: 'lineWidth',
      icon: 'format-line-weight',
      label: _('COMMON.LINE_WEIGHT'),
    },
    {
      type: 'cursor',
      icon: 'cursor-default-click',
      label: _('COMMON.CURSOR'),
    },
    {
      type: 'fullscreen',
      icon: 'arrow-expand-all',
      label: _('COMMON.FULLSCREEN'),
    },
    {
      type: 'refresh',
      icon: 'web-refresh',
      label: _('COMMON.REFRESH'),
    },
  ];

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

  isButtonVisible(buttonType: ButtonType) {
    return this.annotation.state.buttonVisibility[buttonType];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
