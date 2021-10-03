/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { annotatorRoutes } from './annotator.routes';
import { AnnotatorService } from './annotator.service';
import { DrawComponent } from './draw/draw.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(annotatorRoutes)],
  exports: [DrawComponent],
  declarations: [DrawComponent],
  providers: [AnnotatorService],
})
export class AnnotatorModule {}
