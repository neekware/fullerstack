import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnnotatorModule } from '@fullerstack/ngx-annotateee';

import { AnnotateComponent } from './annotate.component';

@NgModule({
  imports: [CommonModule, AnnotatorModule],
  declarations: [AnnotateComponent],
})
export class AnnotateModule {}
