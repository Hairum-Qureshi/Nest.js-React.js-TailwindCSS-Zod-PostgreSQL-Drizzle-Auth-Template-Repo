import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { NeonDBProvider } from 'src/providers/postgres-db';
import { GoogleOAuthConfig } from 'src/providers/google-oauth-config';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: Number(config.get<string>('JWT_EXPIRES')),
          },
        };
      },
    }),
    HttpModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleOAuthConfig, NeonDBProvider],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
