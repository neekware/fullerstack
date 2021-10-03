/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnnotatorModule } from '@fullerstack/ngx-annotator';
import { MaterialModule } from '@fullerstack/ngx-material';
import { SharedModule } from '@fullerstack/ngx-shared';

import { AnnotateComponent } from './annotate.component';

@NgModule({
  imports: [CommonModule, MaterialModule, SharedModule, AnnotatorModule],
  declarations: [AnnotateComponent],
})
export class AnnotateModule {}
