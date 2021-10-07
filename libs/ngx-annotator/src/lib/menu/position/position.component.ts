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

import { MenuPosition } from '../../annotator.model';
import { AnnotatorService } from '../../annotator.service';

@Component({
  selector: 'fullerstack-menu-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuPositionComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(readonly annotation: AnnotatorService) {}

  setPosition(event: Event, position: MenuPosition) {
    event.stopPropagation();
    this.annotation.setState({
      ...this.annotation.state,
      position,
    });
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
