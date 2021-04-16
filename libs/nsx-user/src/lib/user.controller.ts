import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from './user.models';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @UseGuards(new AuthGuardApi())
  @UsePipes(new ValidationPipe())
  async create(@Body() data: Prisma.UserCreateInput): Promise<User> {
    const users = await this.userService.users({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (users?.length) {
      throw new HttpException(
        `User exists - email or username in use!`,
        HttpStatus.BAD_REQUEST
      );
    }

    return this.userService.createUser(data);
  }
}
