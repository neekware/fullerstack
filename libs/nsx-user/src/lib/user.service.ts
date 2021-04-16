import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { USER_PER_PAGE } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>
  ) {}

  async showAll(page = 1) {
    const users = await this.userRepository.find({
      take: USER_PER_PAGE,
      skip: USER_PER_PAGE * (page - 1),
    });
    return users;
  }

  async read(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('Unknown user', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Unknown user', HttpStatus.NOT_FOUND);
    }
    this.userRepository.merge(user, data);
    user = await this.userRepository.save(user);
    return user;
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Unknown user', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.remove(user);
    return { statusCode: 200, message: `User deleted (${id})` };
  }

  async create(data: User) {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user;
  }
}
