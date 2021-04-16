import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  showAll(): Promise<User[]> {
    return this.userService.showAll();
  }

  @Get(':username')
  read(@Param('username') username: string) {
    return this.userService.read(username);
  }

  @Post()
  // @UseGuards(new AuthGuardApi())
  @UsePipes(new ValidationPipe())
  create(@Body() data: User) {
    return this.userService.create(data);
  }

  @Put(':id')
  // @UseGuards(new AuthGuardApi())
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  // @UseGuards(new AuthGuardApi())
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
