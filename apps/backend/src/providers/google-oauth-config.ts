import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export const GoogleOAuthConfig = {
  provide: 'GoogleOAuthClient',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const client = configService.get<string>('GOOGLE_OAUTH_CLIENT_ID');
    const secret = configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET');

    if (!client || !secret) {
      throw new Error(
        'Google OAuth client ID or secret is not defined in environment variables',
      );
    }

    return new OAuth2Client({
      clientId: client,
      clientSecret: secret,
    });
  },
};
