import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCookiesDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  }
);

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    GqlExecutionContext.create(ctx).getContext().req.user
);

export const ResponseDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let ctx;
    try {
      ctx = GqlExecutionContext.create(context);
    } catch (err) {
      console.log(err);
    }
    return ctx.getContext().response;
  }
);
