import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuardGql } from './auth.guard.gql';
import { SecurityService } from './auth.security.service';

@Injectable()
export class AuthGuardAnonymousGql extends AuthGuardGql {
  constructor(readonly securityService: SecurityService) {
    super(securityService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return super.canActivate(context);
    } catch (err) {
      if (!(err instanceof UnauthorizedException)) {
        throw err;
      }
      return true;
    }
  }
}
