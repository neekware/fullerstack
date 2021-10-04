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

import { AnnotatorService } from '../annotator.service';
import { DefaultCanvasButtonAttributes, DefaultLine } from './draw.default';
import { Line } from './draw.model';

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
  private lines: Line[] = [];

  constructor(readonly uix: UixService, readonly annotatorService: AnnotatorService) {
    this.uix.addClassToBody('annotation-canvas');
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas?.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');

    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.annotatorService.state.lineWidth;
    this.ctx.strokeStyle = this.annotatorService.state.strokeStyle;

    this.resizeCanvas(this.canvasEl);
    this.captureEvents(this.canvasEl);
    this.handleTrash();
    this.handleUndo();
  }

  private handleTrash() {
    this.annotatorService.trash$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doTrash();
      },
    });
  }

  doTrash() {
    this.lines = [];
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  private handleUndo() {
    this.annotatorService.undo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doUndo();
      },
    });
  }

  doUndo() {
    if (this.lines.length) {
      this.lines.pop();
      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.lines.forEach((line) => this.drawOnCanvas(line));
    }
  }

  private fromEvents(canvasEl: HTMLCanvasElement, eventNames: string[]): Observable<Event> {
    return eventNames.reduce((prev, name) => merge(prev, fromEvent(canvasEl, name)), EMPTY);
  }

  private resizeCanvas(canvasEl: HTMLCanvasElement) {
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        canvasEl.width = size.x;
        canvasEl.height = size.y;
        this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.lines.forEach((line) => this.drawOnCanvas(line));
      },
    });
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    let line: Line = ldDeepClone({
      ...DefaultLine,
      lineCap: this.annotatorService.state.lineCap,
      lineWidth: this.annotatorService.state.lineWidth,
      strokeStyle: this.annotatorService.state.strokeStyle,
    });

    this.fromEvents(canvasEl, ['mousedown', 'touchstart'])
      .pipe(
        tap(() => {
          if (line.points.length) {
            this.lines.push(ldDeepClone(line));
            line = ldDeepClone(DefaultLine);
            line.points = [];
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
        this.drawOnCanvas(line);
      });
  }

  private drawOnCanvas(line: Line) {
    if (!this.ctx) {
      return;
    }

    this.ctx.beginPath();

    if (line.points.length > 1) {
      const from = line.points[line.points.length - 2];
      const to = line.points[line.points.length - 1];

      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = line.lineWidth;
      this.ctx.strokeStyle = line.strokeStyle;

      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.stroke();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('annotation-canvas');
  }
}
