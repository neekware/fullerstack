/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { cloneDeep as ldDeepClone } from 'lodash-es';
import { EMPTY, Observable, Subject, fromEvent, merge } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { DefaultCanvasButtonAttributes } from './draw.default';
import { Point } from './draw.model';

@Component({
  selector: 'fullerstack-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef | undefined;
  @Input() attr = DefaultCanvasButtonAttributes;
  uniqId = uuidV4();
  private destroy$ = new Subject<boolean>();
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private activePoints: Point[][] = [];
  private shadowPoints: Point[][] = [];

  constructor(readonly uix: UixService) {}

  ngAfterViewInit() {
    this.canvasEl = this.canvas?.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';

    this.resizeCanvas(this.canvasEl);
    this.captureEvents(this.canvasEl);
  }

  private fromEvents(canvasEl: HTMLCanvasElement, eventNames: string[]): Observable<Event> {
    return eventNames.reduce((prev, name) => merge(prev, fromEvent(canvasEl, name)), EMPTY);
  }

  private resizeCanvas(canvasEl: HTMLCanvasElement) {
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        canvasEl.width = size.x;
        canvasEl.height = size.y;
      },
    });
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    let segment: Point[] = [];
    this.fromEvents(canvasEl, ['mousedown', 'touchstart'])
      .pipe(
        tap((event) => {
          if (event.type === 'touchstart') {
            this.uix.addClassToBody('fullscreen-canvas');
          }
          if (segment.length) {
            this.activePoints.push([...segment]);
            this.shadowPoints.push(ldDeepClone(segment));
            segment = [];
          }
        }),
        switchMap(() => {
          return this.fromEvents(canvasEl, ['mousemove', 'touchmove']).pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            takeUntil(fromEvent(canvasEl, 'touchend'))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((event: MouseEvent | TouchEvent) => {
        const rect = canvasEl.getBoundingClientRect();
        if (event instanceof MouseEvent) {
          segment.push({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        } else if (event instanceof TouchEvent) {
          segment.push({
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top,
          });
        }
        this.drawOnCanvas(segment);
      });
  }

  private drawOnCanvas(segment: Point[]) {
    if (!this.ctx) {
      return;
    }

    this.ctx.beginPath();

    if (segment.length > 1) {
      const from = segment[segment.length - 2];
      const to = segment[segment.length - 1];

      this.ctx.lineWidth = 2.5;
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = '#000';

      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.stroke();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('fullscreen-canvas');
  }
}
