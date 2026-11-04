import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from '@repo/shared-types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return null;

    const userPayload = {
      _id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profilePicture: user.profile_picture,
    };
    return userPayload;
  },
);
