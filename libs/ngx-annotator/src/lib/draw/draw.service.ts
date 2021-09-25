import { Injectable } from '@angular/core';

import { CANVAS_MIN_POINTS_TO_DRAW, Point } from './draw.model';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  /**
   * Given a list of points, draw a line between them.
   * @param points list of points to draw
   * @param ctx canvas context
   * @returns void
   */
  drawPoints(points: Point[], ctx: CanvasRenderingContext2D): void {
    if (!points?.length || !ctx) return;

    if (points.length >= CANVAS_MIN_POINTS_TO_DRAW) {
      ctx.beginPath();

      const start = points[0];
      ctx.moveTo(start.x, start.y);

      // start from the first to the second last points
      // and draw a number of quadratics
      // the average of two points is used as the control point
      let idx = 1;
      for (; idx < points.length - 2; idx++) {
        const point = points[idx];
        const controlPoint: Point = {
          x: (points[idx].x + points[idx + 1].x) / 2,
          y: (points[idx].y + points[idx + 1].y) / 2,
        };

        ctx.quadraticCurveTo(point.x, point.y, controlPoint.x, controlPoint.y);
      }

      // handle the last two points
      ctx.quadraticCurveTo(points[idx].x, points[idx].y, points[idx + 1].x, points[idx + 1].y);

      // outline the path with the stroke style.
      ctx.stroke();
    } else {
      // not enough points, just draw a basic circle instead
      const start = points[0];
      ctx.beginPath(),
        ctx.arc(start.x, start.y, ctx.lineWidth / 2, 0, Math.PI * 2, true),
        ctx.closePath(),
        ctx.fill();
    }
  }

  getMouse(event: MouseEvent, element: HTMLElement): Point {
    let el = element;
    const offset: Point = { x: 0, y: 0 };
    const mouse: Point = { x: 0, y: 0 };

    // Compute the total offset. It's possible to cache this if you want
    if (el.offsetParent !== undefined) {
      do {
        offset.x += el.offsetLeft;
        offset.y += el.offsetTop;
      } while ((el = el.offsetParent as HTMLElement));
    }

    mouse.x = event.pageX - offset.x;
    mouse.y = event.pageY - offset.y;

    return mouse;
  }
}
