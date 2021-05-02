import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { MsgModule, MsgService } from '@fullerstack/ngx-msg';

import { AuthStoreState } from './store/auth-state.store';
import { AuthEffect } from './store/auth-state.effect';
import { AuthService } from './auth.service';

@NgModule({
  imports: [CommonModule, MsgModule, NgxsModule.forFeature([AuthStoreState])],
  providers: [AuthService, MsgService, AuthEffect],
})
export class AuthModule {}
