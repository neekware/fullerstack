import { Entity, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel } from '@fullerstack/nsx-common';
import { Role } from './user.types';

@Entity('user')
export class UserEntity extends BaseModel {
  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  firstName: string;

  @Column({ length: 100, nullable: true })
  lastName: string;

  @Column({ length: 255 })
  password: string;

  @Column('text')
  gender: Role;

  /**
   * Before the initial insert, use a scrambled password
   * Note: avoiding empty password attack
   */
  @BeforeInsert()
  async setPassword() {
    if (!this.password) {
      this.password = uuidv4();
    }
  }
}
