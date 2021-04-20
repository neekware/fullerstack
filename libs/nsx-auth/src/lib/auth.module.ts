import { Global, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SecurityService } from './auth.security.service';
import { AuthResolver } from './auth.resolver';
import { AuthGuardPermissions, AuthGuardRoles } from './auth.guard';

@Global()
@Module({
  providers: [
    SecurityService,
    AuthService,
    AuthGuardRoles,
    AuthGuardPermissions,
    AuthResolver,
  ],
  exports: [
    SecurityService,
    AuthService,
    AuthGuardRoles,
    AuthGuardPermissions,
    AuthResolver,
  ],
})
export class AuthModule {}
