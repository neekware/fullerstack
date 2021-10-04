/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ConfigComponent } from '../config/config.component';
import { DefaultCanvasMenuAttributes } from './menu.default';

@Component({
  selector: 'fullerstack-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MenuComponent implements OnDestroy {
  @Input() attr = DefaultCanvasMenuAttributes;
  private destroy$ = new Subject<boolean>();
  private dialogRef: MatDialogRef<ConfigComponent>;
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    this.dialogRef = this.dialog.open(ConfigComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      hasBackdrop: false,
      panelClass: 'fullscreen-canvas',
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.dialogRef?.close();
  }
}
