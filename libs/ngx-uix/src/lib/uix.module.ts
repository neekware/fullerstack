import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialService } from '@fullerstack/ngx-material';

import { UixService } from './uix.service';

@NgModule({
  imports: [CommonModule],
  providers: [UixService, MaterialService],
})
export class UixModule {}
