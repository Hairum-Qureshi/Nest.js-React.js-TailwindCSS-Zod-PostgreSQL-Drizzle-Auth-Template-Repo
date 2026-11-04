import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { usersTable } from 'src/schema';
import type { Database } from 'src/providers/postgres-db';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('NeonDBProvider') private readonly db: Database,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['auth-session'],
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: { id: string; sub: string }) {
    const { id } = payload;
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, BigInt(id)))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Please log in first');
    }
    return { ...user, id: String(user.id) };
  }
}
