import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Employe } from './employe.entity';

import { User } from 'src/users/entities/user.entity';
import { EnterpriseGroup } from './enterpriseGroup.entity';

@Entity({ name: 'enterprises' })
export class Enterprise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  coords: string;

  @ManyToOne(() => User, (user) => user.enterprises)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Employe, (employe) => employe.enterprise)
  employes: Employe[];

  @OneToMany(
    () => EnterpriseGroup,
    (enterpriseGroup) => enterpriseGroup.enterprise,
    {
      eager: true,
    },
  )
  groups: EnterpriseGroup[];
}
