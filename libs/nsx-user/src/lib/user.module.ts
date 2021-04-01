import { Module } from '@nestjs/common';
import { PrismaModule } from '@fullerstack/nsx-prisma';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { PasswordService } from './user.password.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserResolver, PasswordService],
  exports: [UserService, UserResolver],
})
export class UserModule {}
