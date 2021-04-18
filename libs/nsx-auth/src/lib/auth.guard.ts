import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { tryGet } from '@fullerstack/agx-utils';
import { SecurityService } from './auth.security.service';
import { HttpRequest } from '@fullerstack/nsx-common';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly securityService: SecurityService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as HttpRequest;
    const authorization = tryGet(() => request.headers.authorization);
    if (!authorization) {
      return false;
    }

    const token = authorization.replace('Bearer ', '');
    if (token) {
      const payload = this.securityService.verifyToken(token);
      if (payload) {
        const user = await this.securityService.validateUser(payload.userId);
        if (user) {
          request.user = user;
          return true;
        }
      }
    }
    return false;
  }
}
