import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { tryGet } from '@fullerstack/agx-utils';
import { SecurityService } from './auth.security.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject('securityService') private readonly securityService: SecurityService
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().request;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = tryGet(() => request.headers.authorization);
    if (!authorization) {
      return false;
    }

    const token = authorization.replace('Bearer ', '');
    if (token) {
      const payload = this.securityService.verifyToken(token);
      if (payload) {
        const user = this.securityService.validateUser(payload.userId);
        if (user) {
          request.token = token;
          request.user = user;
          return true;
        }
      }
    }
    return false;
  }
}
