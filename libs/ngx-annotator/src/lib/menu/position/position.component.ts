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

import { MenuPosition } from '../../annotator.model';
import { AnnotatorService } from '../../annotator.service';

interface SupportedCorner {
  position: MenuPosition;
  icon: string;
  class: string;
  label: string;
}

@Component({
  selector: 'fullerstack-menu-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuPositionComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  corners: SupportedCorner[] = [
    {
      position: 'top-right',
      icon: 'select-drag',
      class: 'flip-vertical',
      label: _('COMMON.POSITION.TOP_RIGHT'),
    },
    {
      position: 'top-left',
      icon: 'select-drag',
      class: 'flip-vertical-horizontal',
      label: _('COMMON.POSITION.TOP_LEFT'),
    },
    {
      position: 'bottom-right',
      icon: 'select-drag',
      class: '',
      label: _('COMMON.POSITION.BOTTOM_RIGHT'),
    },
    {
      position: 'bottom-left',
      icon: 'select-drag',
      class: 'flip-vertical',
      label: _('COMMON.POSITION.BOTTOM_LEFT'),
    },
  ];

  constructor(readonly annotation: AnnotatorService) {}

  setPosition(event: Event, position: MenuPosition) {
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      position,
    });
  }

  isPosition(position: MenuPosition) {
    return this.annotation.state.position === position;
  }

  toggleVertical(event: Event) {
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      vertical: !this.annotation.state.vertical,
    });
  }

  toggleRevere(event: Event) {
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      reverse: !this.annotation.state.reverse,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
