import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { PasswordService } from './auth.password.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
  controllers: [AuthController],
  providers: [PrismaService, PasswordService, AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
