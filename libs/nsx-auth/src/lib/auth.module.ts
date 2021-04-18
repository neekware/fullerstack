import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { merge as ldNestedMerge } from 'lodash';

import { SecurityConfig } from '@fullerstack/nsx-common';
import { PrismaService } from '@fullerstack/nsx-prisma';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './auth.password.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { AUTH_SECURITY_CONFIG } from './auth.constants';

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: ldNestedMerge(
              { ...AUTH_SECURITY_CONFIG },
              { securityConfig }
            ).expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    PasswordService,
    AuthService,
    AuthResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
