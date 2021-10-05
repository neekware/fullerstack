/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject } from 'rxjs';

import { AnnotatorService } from '../annotator.service';
import { ConfigComponent } from '../config/config.component';
import { DefaultCanvasMenuAttributes } from './menu.default';

@Component({
  selector: 'fullerstack-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuComponent implements OnDestroy {
  @Input() attr = DefaultCanvasMenuAttributes;
  private destroy$ = new Subject<boolean>();
  private dialogRef: MatDialogRef<ConfigComponent>;
  menuIconState = 'back';
  trashIconState = 'back';
  undoIconState = 'back';
  redoIconState = 'back';
  cursorIconState = 'back';
  isFullscreen = false;

  constructor(
    readonly dialog: MatDialog,
    readonly uix: UixService,
    readonly annotation: AnnotatorService
  ) {}

  openDialog(): void {
    this.menuIconState = this.menuIconState === 'back' ? 'forth' : 'back';

    this.dialogRef = this.dialog.open(ConfigComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      hasBackdrop: false,
      panelClass: 'annotation-canvas',
    });
  }

  trash() {
    this.trashIconState = this.trashIconState === 'back' ? 'forth' : 'back';
    this.annotation.trash();
  }

  undo() {
    this.undoIconState = this.undoIconState === 'back' ? 'forth' : 'back';
    this.annotation.undo();
  }

  redo() {
    this.redoIconState = this.redoIconState === 'back' ? 'forth' : 'back';
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
    this.cursorIconState = this.cursorIconState === 'back' ? 'forth' : 'back';
    this.annotation.setState({ cursor: !this.annotation.state.cursor });
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.dialogRef?.close();
  }
}
