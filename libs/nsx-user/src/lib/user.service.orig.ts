import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { USER_PER_PAGE } from './user.constants';
import { SecurityService } from './user.password.service';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private securityService: SecurityService
  ) {}

  async showAll(page = 1) {
    const users = await this.prisma.user.findMany({
      where: { NOT: [{ id: null }] },
      take: USER_PER_PAGE,
      skip: USER_PER_PAGE * (page - 1),
    });
    return users;

    //   where
    // }) .find({
    //   take: USER_PER_PAGE,
    //   skip: USER_PER_PAGE * (page - 1),
    // });
    // return tryGet(() => users.map((user) => user.toResponseDTO()), []);
  }

  async read(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new HttpException('Unknown user', HttpStatus.NOT_FOUND);
    }
    return user; //tryGet(() => user.toResponseDTO());
  }

  // async update(
  //   id: string,
  //   data: Partial<UserUpdateDTO>
  // ): Promise<UserResponseDTO> {
  //   let user = await this.prisma.findOne({ where: { id } });
  //   if (!user) {
  //     throw new HttpException('Unknown user', HttpStatus.NOT_FOUND);
  //   }
  //   this.prisma.merge(user, data);
  //   user = await this.prisma.save(user);
  //   return tryGet(() => user.toResponseDTO());
  // }

  async delete(id: number) {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) {
      throw new HttpException('Unknown user', HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.delete({ where: { id } });
    return { statusCode: 200, message: `User deleted (${id})` };
  }

  // async create(data: UserCreateDTO) {
  //   const { username } = data;
  //   let user = await this.prisma.findOne({ where: { username } });
  //   if (user) {
  //     throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
  //   }
  //   user = await this.prisma.create(data);
  //   await this.prisma.save(user);
  //   return tryGet(() =>
  //     user.toResponseDTO({ includeToken: true, includeEmail: true })
  //   );
  // }
}
