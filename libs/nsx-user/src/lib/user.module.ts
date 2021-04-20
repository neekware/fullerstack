import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Global()
@Module({
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
