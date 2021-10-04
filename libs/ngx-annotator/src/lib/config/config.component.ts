/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Subject, takeUntil } from 'rxjs';

import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  private lineWidthChange$ = new Subject<number>();

  constructor(
    readonly dialogRef: MatDialogRef<ConfigComponent>,
    readonly annotatorService: AnnotatorService
  ) {}

  ngOnInit(): void {
    // set line width
    this.lineWidthChange$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        this.annotatorService.setState({ lineWidth: value });
      },
    });
  }

  setLineWidth(event: MatSliderChange) {
    this.lineWidthChange$.next(event.value);
  }

  onClose(): void {
    this.dialogRef?.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
