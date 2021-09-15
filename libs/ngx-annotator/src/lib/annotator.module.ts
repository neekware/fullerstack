import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { annotatorRoutes } from './annotator.routes';
import { AnnotatorService } from './annotator.service';
import { AnnotatorComponent } from './canvas/annotator.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(annotatorRoutes)],
  exports: [AnnotatorComponent],
  declarations: [AnnotatorComponent],
  providers: [AnnotatorService],
})
export class AnnotatorModule {}
