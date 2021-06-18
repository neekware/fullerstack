/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MsgModule, MsgService } from '@fullerstack/ngx-msg';
import { NgxsModule } from '@ngxs/store';

import { AuthService } from './auth.service';
import { AuthAsyncValidation } from './auth.validation';
import { AuthEffectsService } from './store/auth-state.effect';
import { AuthStoreState } from './store/auth-state.store';

@NgModule({
  imports: [CommonModule, MsgModule, NgxsModule.forFeature([AuthStoreState])],
  providers: [AuthService, MsgService, AuthEffectsService, AuthAsyncValidation],
})
export class AuthModule {}
