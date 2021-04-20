import { Global, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SecurityService } from './auth.security.service';
import { AuthResolver } from './auth.resolver';
import { AuthGuardGql } from './auth.guard.gql';
import { AuthGuardRole } from './auth.guard.role';
import { AuthGuardPermission } from './auth.guard.permission';

@Global()
@Module({
  providers: [
    SecurityService,
    AuthService,
    AuthGuardRole,
    AuthGuardPermission,
    AuthResolver,
    AuthGuardGql,
  ],
  exports: [
    SecurityService,
    AuthService,
    AuthGuardRole,
    AuthGuardPermission,
    AuthGuardGql,
    AuthResolver,
  ],
})
export class AuthModule {}
