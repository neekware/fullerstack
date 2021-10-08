/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, fromEvent } from 'rxjs';
import { filter, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { Line } from '../annotator.model';
import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef | undefined;
  uniqId = uuidV4();
  private destroy$ = new Subject<boolean>();
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private lines: Line[] = [];

  constructor(
    readonly zone: NgZone,
    readonly uix: UixService,
    readonly annotation: AnnotatorService
  ) {
    this.uix.addClassToBody('annotation-canvas');
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas?.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    setTimeout(() => {
      this.annotation.setCanvasAttributes(this.ctx);
    }, 100);
    this.resizeCanvas(this.canvasEl);
    this.captureEvents(this.canvasEl);
    this.trashSub();
    this.undoSub();
    this.redoSub();
    this.stateSub();
  }

  private trashSub() {
    this.annotation.trash$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doTrash();
      },
    });
  }

  doTrash() {
    this.lines = [];
    this.annotation.resetCanvas(this.canvasEl, this.ctx);
  }

  private undoSub() {
    this.annotation.undo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doUndo();
      },
    });
  }

  doUndo() {
    const atLeastOneVisibleLineToUndo = this.lines[0]?.visible;
    if (atLeastOneVisibleLineToUndo) {
      this.annotation.undoLastLine(this.lines);
      this.annotation.resetCanvas(this.canvasEl, this.ctx);
      this.lines.forEach((line) => this.annotation.drawLineOnCanvas(line, this.ctx));
    }
  }

  private redoSub() {
    this.annotation.redo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doRedo();
      },
    });
  }

  doRedo() {
    const atLeastOneInvisibleLineToRedo = !this.lines[this.lines.length - 1].visible;
    if (atLeastOneInvisibleLineToRedo) {
      this.annotation.redoLastLine(this.lines);
      this.annotation.resetCanvas(this.canvasEl, this.ctx);
      this.lines.forEach((line) => this.annotation.drawLineOnCanvas(line, this.ctx));
    }
  }

  private stateSub() {
    this.annotation.stateSub$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (state) => {
          this.annotation.setCanvasAttributes(this.ctx, {
            lineCap: state.lineCap,
            lineJoin: state.lineJoin,
            lineWidth: state.lineWidth,
            strokeStyle: state.strokeStyle,
          });
        },
      });
  }

  private resizeCanvas(canvasEl: HTMLCanvasElement) {
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        canvasEl.width = size.x;
        canvasEl.height = size.y;
        canvasEl.style.width = `${size.x}px`;
        canvasEl.style.height = `${size.y}px`;
        this.annotation.resetCanvas(this.canvasEl, this.ctx);
        this.annotation.setCanvasAttributes(this.ctx);
        this.lines.forEach((line) => this.annotation.drawLineOnCanvas(line, this.ctx));
      },
    });
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    let line: Line = this.annotation.cloneLine();
    this.zone.runOutsideAngular(() => {
      this.annotation
        .fromEvents(canvasEl, ['mousedown', 'touchstart'])
        .pipe(
          switchMap(() => {
            return this.annotation.fromEvents(canvasEl, ['mousemove', 'touchmove']).pipe(
              finalize(() => {
                if (line.points.length) {
                  // abandon hidden lines "the undo(s)" on any further update
                  this.lines = this.lines.filter((lineItem) => lineItem.visible).concat(line);
                  this.zone.run(() => {
                    this.annotation.drawDotOnCanvas(line.points[0], this.ctx);
                  });
                  line = this.annotation.cloneLine();
                }
              }),
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              takeUntil(fromEvent(canvasEl, 'touchend'))
            );
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (event: MouseEvent | TouchEvent) => {
            const rect = canvasEl.getBoundingClientRect();

            if (event instanceof MouseEvent) {
              line.points.push({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            } else if (event instanceof TouchEvent) {
              line.points.push({
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top,
              });
            }

            if (line.points.length > 1) {
              this.zone.run(() => {
                this.annotation.drawFromToOnCanvas(
                  line.points[line.points.length - 2],
                  line.points[line.points.length - 1],
                  this.ctx
                );
              });
            }
          },
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('annotation-canvas');
  }
}
