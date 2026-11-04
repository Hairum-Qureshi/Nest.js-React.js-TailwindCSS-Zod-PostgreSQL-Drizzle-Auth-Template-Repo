import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const authHeader = (request.headers as unknown as { authorization: string })
      .authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') return null;

    return token;
  },
);
