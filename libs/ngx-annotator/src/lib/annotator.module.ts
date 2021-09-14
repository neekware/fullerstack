import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnnotatorComponent } from './canvas/annotator.component';

@NgModule({
  imports: [CommonModule],
  exports: [AnnotatorComponent],
  declarations: [AnnotatorComponent],
})
export class AnnotatorModule {}
