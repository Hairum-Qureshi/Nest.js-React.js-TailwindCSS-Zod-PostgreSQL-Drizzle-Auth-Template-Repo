import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '@repo/shared-types';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import SnowflakeId from 'snowflake-id';
import { firstValueFrom } from 'rxjs';
import { eq } from 'drizzle-orm';
import { usersTable } from 'src/schema';
import type { Database } from 'src/providers/postgres-db';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('GoogleOAuthClient') private googleOAuthClient: OAuth2Client,
    private configService: ConfigService,
    @Inject('NeonDBProvider') private readonly db: Database,
    private httpService: HttpService,
  ) {}

  getAuthCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
    };
  }

  async googleAuth(
    accessToken: string,
  ): Promise<{ jwtToken: string; newAccount: boolean }> {
    const response = await firstValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    if (response.status !== 200) {
      throw new UnauthorizedException('Invalid Google access token');
    }

    const googleUser = (await response.data) as {
      email: string;
      picture: string;
      given_name: string;
      family_name: string;
    };

    const { email, picture, given_name, family_name } = googleUser;

    let [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      const snowflake = new SnowflakeId({
        mid: 42,
        offset: (2026 - 1970) * 31536000 * 1000,
      });

      [user] = await this.db
        .insert(usersTable)
        .values({
          id: snowflake.generate(),
          first_name: given_name,
          last_name: family_name,
          email,
          profile_picture: picture,
        })
        .returning();
      const jwtToken = this.jwtService.sign({ id: String(user.id) });

      return {
        jwtToken,
        newAccount: true,
      };
    }

    const jwtToken = this.jwtService.sign({ id: String(user.id) });

    return { jwtToken, newAccount: false };
  }

  getCurrentUser(user: UserPayload): UserPayload {
    return user;
  }
}
