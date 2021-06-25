import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreService } from './store.service';

@NgModule({
  imports: [CommonModule],
  providers: [StoreService],
})
export class StoreModule {}
