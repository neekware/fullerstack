import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordService } from './user.password.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PasswordService],
  exports: [UserService],
})
export class UserModule {}
