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
