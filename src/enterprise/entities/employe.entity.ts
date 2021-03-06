import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { EmployeRole } from '../types/employe.type';

import { Enterprise } from './enterprise.entity';
import { User } from '../../users/entities/user.entity';
import { EmployeTime } from './employeTime.entity';
import { EnterpriseGroup } from './enterpriseGroup.entity';

@Entity({ name: 'employes' })
export class Employe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EmployeRole, default: EmployeRole.WORKER })
  role: EmployeRole;

  @Column({ name: 'enterprises_id', nullable: true })
  enterpriseId: number;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.employes)
  @JoinColumn({ name: 'enterprises_id' })
  enterprise: Enterprise;

  @Column({ name: 'users_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.employe, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'users_id' })
  user: User;

  @Column({ name: 'enterprise_group_id', nullable: true })
  enterpriseGroupId: number;

  @ManyToOne(() => EnterpriseGroup, (group) => group.employees, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'enterprise_group_id' })
  group: EnterpriseGroup;

  @OneToMany(() => EmployeTime, (employeTime) => employeTime.employe)
  employeTimes: EmployeTime[];
}
