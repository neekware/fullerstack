/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

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

  setPosition(event: MatRadioChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, position: event.value },
    });
  }

  setVertical(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, vertical: event.checked },
    });
  }

  setReverse(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, reverse: event.checked },
    });
  }

  showTrashButton(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, showTrashButton: event.checked },
    });
  }

  showUndoButton(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, showUndoButton: event.checked },
    });
  }

  showRedoButton(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, showRedoButton: event.checked },
    });
  }

  showLineWidthButton(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, showLineWidthButton: event.checked },
    });
  }

  showCursorButton(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, showCursorButton: event.checked },
    });
  }

  showFullscreenButton(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, showFullscreenButton: event.checked },
    });
  }

  showRefreshButton(event: MatCheckboxChange) {
    this.annotation.setState({
      menuOptions: { ...this.annotation.state.menuOptions, showRefreshButton: event.checked },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
