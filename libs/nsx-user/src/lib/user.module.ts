import { Module } from '@nestjs/common';
import { PrismaModule } from '@fullerstack/nsx-prisma';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
