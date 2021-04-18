import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  getCookiesFromContext,
  getRequestFromContext,
  getResponseFromContext,
} from './auth.utils';

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
