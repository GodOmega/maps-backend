import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Employe } from './employe.entity';
import { EmployeTimeStatus } from '../types/employe.type';

@Entity({ name: 'employes_time' })
export class EmployeTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'client_id' })
  clientId: string;

  @Column({ type: 'text' })
  uuid: string;

  @ManyToOne(() => Employe, (employe) => employe.employeTimes, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'employe_id' })
  employe: Employe;

  @Column({
    type: 'enum',
    enum: EmployeTimeStatus,
    default: EmployeTimeStatus.ONLINE,
  })
  status: EmployeTimeStatus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'time',
  })
  time: Date;
}
