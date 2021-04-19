import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  getCookiesFromContext,
  getRequestFromContext,
  getResponseFromContext,
} from './auth.util';

export const CookiesDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return getCookiesFromContext(context);
  }
);

export const RequestDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return getRequestFromContext(context);
  }
);

export const ResponseDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return getResponseFromContext(context);
  }
);

export const UserDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return getRequestFromContext(context).user as User;
  }
);
