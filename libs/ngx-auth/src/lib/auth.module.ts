import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { MsgModule } from '@fullerstack/ngx-msg';

@NgModule({
  imports: [CommonModule, MsgModule],
  providers: [AuthService],
})
export class AuthModule {}
