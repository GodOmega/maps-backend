import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

// ENTITIES
import { Employe } from '../../enterprise/entities/employe.entity';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';

// TYPES
import { USER_GENDER, USER_ROLE } from '../models/user.models';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 255 })
  username: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  lastname: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: USER_GENDER,
  })
  gender: USER_GENDER;

  @Column({
    type: 'enum',
    default: USER_ROLE.WORKER,
    enum: USER_ROLE,
  })
  role: USER_ROLE;

  @Column({ type: 'text', nullable: true })
  image: string;

  @OneToOne(() => Employe, (employe) => employe.user)
  employe: Employe;

  @OneToMany(() => Enterprise, (enterprise) => enterprise.user)
  enterprises: Enterprise[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;
}
