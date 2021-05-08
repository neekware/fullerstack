import { Global, Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Global()
@Module({
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
