import { Component, OnInit } from '@angular/core';
import p5 from 'p5';

import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.scss'],
})
export class AnnotatorComponent implements OnInit {
  constructor(readonly annotatorService: AnnotatorService) {}

  canvas: any;
  sw = 2;
  c = [];
  strokeColor = 0;

  ngOnInit() {
    // this sketch was modified from the original
    // https://editor.p5js.org/Janglee123/sketches/HJ2RnrQzN
    const sketch = (s) => {
      s.setup = () => {
        const canvas2 = s.createCanvas(s.windowWidth, s.windowHeight);
        canvas2.parent('sketch-holder');

        s.background(255);
        s.strokeWeight(this.sw);

        this.c[0] = s.color(148, 0, 211);
        this.c[1] = s.color(75, 0, 130);
        this.c[2] = s.color(0, 0, 255);
        this.c[3] = s.color(0, 255, 0);
        this.c[4] = s.color(255, 255, 0);
        this.c[5] = s.color(255, 127, 0);
        this.c[6] = s.color(255, 0, 0);

        s.rect(0, 0, s.width, s.height);

        s.stroke(this.c[this.strokeColor]);
      };

      s.draw = () => {
        if (s.mouseIsPressed) {
          if (s.mouseButton === s.LEFT) {
            s.line(s.mouseX, s.mouseY, s.pmouseX, s.pmouseY);
          } else if (s.mouseButton === s.CENTER) {
            s.background(255);
          }
        }
      };

      // s.mouseReleased = () => {
      //   // modulo math forces the color to swap through the array provided
      //   this.strokeColor = (this.strokeColor + 1) % this.c.length;
      //   s.stroke(this.c[this.strokeColor]);
      //   // console.log(`color is now ${this.c[this.strokeColor]}`);
      // };

      s.keyPressed = () => {
        if (s.key === 'c') {
          window.location.reload();
        }
      };
    };

    this.canvas = new p5(sketch);
  }
}
