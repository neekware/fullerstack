import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { cloneDeep as ldDeepClone } from 'lodash-es';
import { Subject, fromEvent } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { Point } from './draw.model';

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
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        tap(() => {
          if (segment.length) {
            this.activePoints.push([...segment]);
            this.shadowPoints.push(ldDeepClone(segment));
            segment = [];
          }
        }),
        switchMap(() => {
          return fromEvent(canvasEl, 'mousemove').pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave'))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((event: MouseEvent) => {
        const rect = canvasEl.getBoundingClientRect();
        segment.push({ x: event.clientX - rect.left, y: event.clientY - rect.top });
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
  }
}
