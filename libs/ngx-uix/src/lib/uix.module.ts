import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UixService } from './uix.service';

@NgModule({
  imports: [CommonModule],
  providers: [UixService],
})
export class UixModule {}
