import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamptz', readonly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', readonly: true })
  updatedAt: Date;
}
