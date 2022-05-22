import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Employe } from './employe.entity';

import { Enterprise } from './enterprise.entity';

@Entity({ name: 'enterprise_groups' })
export class EnterpriseGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  perimeter: string;

  @Column({ name: 'enterprises_id' })
  enterpriseId: number;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enterprises_id' })
  enterprise: Enterprise;

  @OneToMany(() => Employe, (employe) => employe.group)
  employees: Employe[];
}
