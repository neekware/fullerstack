import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MsgModule, MsgService } from '@fullerstack/ngx-msg';
import { NgxsModule } from '@ngxs/store';

import { AuthService } from './auth.service';
import { AuthEffectsService } from './store/auth-state.effect';
import { AuthStoreState } from './store/auth-state.store';

@NgModule({
  imports: [CommonModule, MsgModule, NgxsModule.forFeature([AuthStoreState])],
  providers: [AuthService, MsgService, AuthEffectsService],
})
export class AuthModule {}
