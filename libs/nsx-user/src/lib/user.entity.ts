import { Entity, Column, BeforeInsert } from 'typeorm';
import { v4 as uuid_v4 } from 'uuid';
import { BaseModel } from '@fullerstack/nsx-common';
import { Role } from './user.types';

@Entity('user')
export class User extends BaseModel {
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ length: 100, nullable: true })
  firstName: string;

  @Column({ length: 100, nullable: true })
  lastName: string;

  @Column({ length: 255, nullable: false })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'text', default: Role.USER })
  role: Role;

  /**
   * Before the initial insert
   * 1: avoiding empty password attack
   * 2: allow for differed username option
   */
  @BeforeInsert()
  async setRequiredDefaults() {
    if (!this.password) {
      this.password = uuid_v4();
    }

    if (!this.username) {
      this.username = uuid_v4().split('-').join('');
    }
  }
}
