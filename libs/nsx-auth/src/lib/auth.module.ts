import { Module } from '@nestjs/common';

import { PrismaService } from '@fullerstack/nsx-prisma';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityService } from './auth.security.service';
import { AuthResolver } from './auth.resolver';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, SecurityService, AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
