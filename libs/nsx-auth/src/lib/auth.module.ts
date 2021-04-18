import { Global, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SecurityService } from './auth.security.service';
import { AuthResolver } from './auth.resolver';
import { GqlAuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [SecurityService, AuthService, GqlAuthGuard, AuthResolver],
  exports: [SecurityService, AuthService, GqlAuthGuard],
})
export class AuthModule {}
