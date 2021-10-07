/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject } from 'rxjs';

import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  optionsIconState = 'back';
  trashIconState = 'back';
  undoIconState = 'back';
  redoIconState = 'back';
  cursorIconState = 'back';
  isFullscreen = false;

  constructor(readonly uix: UixService, readonly annotation: AnnotatorService) {}

  get topPosition(): string {
    switch (this.annotation.state.position) {
      case 'top-left':
      case 'top-right':
        return '2px';
      default:
        return 'unset';
    }
  }

  get bottomPosition(): string {
    switch (this.annotation.state.position) {
      case 'bottom-left':
      case 'bottom-right':
        return '2px';
      default:
        return 'unset';
    }
  }

  get leftPosition(): string {
    switch (this.annotation.state.position) {
      case 'top-left':
      case 'bottom-left':
        return '2px';
      default:
        return 'unset';
    }
  }

  get rightPosition(): string {
    switch (this.annotation.state.position) {
      case 'top-right':
      case 'bottom-right':
        return '2px';
      default:
        return 'unset';
    }
  }

  get flexLayout(): string {
    let layout = this.annotation.state.vertical ? 'column' : 'row';
    layout = this.annotation.state.reverse ? `${layout}-reverse` : layout;
    return layout;
  }

  trash() {
    if (this.annotation.state.vertical) {
      this.trashIconState = this.trashIconState === 'back' ? 'forth' : 'back';
    }
    this.annotation.trash();
  }

  undo() {
    if (this.annotation.state.vertical) {
      this.undoIconState = this.undoIconState === 'back' ? 'forth' : 'back';
    }
    this.annotation.undo();
  }

  redo() {
    if (this.annotation.state.vertical) {
      this.redoIconState = this.redoIconState === 'back' ? 'forth' : 'back';
    }
    this.annotation.redo();
  }

  setLineWidth(event: MatSliderChange) {
    this.annotation.setState({ lineWidth: event.value });
  }

  toggleFullscreen() {
    this.uix.toggleFullscreen();
    setTimeout(() => {
      this.isFullscreen = this.uix.isFullscreen();
    }, 100);
  }

  toggleCursor() {
    if (this.annotation.state.vertical) {
      this.cursorIconState = this.cursorIconState === 'back' ? 'forth' : 'back';
    }
    this.annotation.setState({ cursor: !this.annotation.state.cursor });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
