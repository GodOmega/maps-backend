import {MigrationInterface, QueryRunner} from "typeorm";
import * as bcrypt from 'bcrypt'

import { User } from "src/users/entities/user.entity";
import { USER_ROLE, USER_GENDER } from "src/users/models/user.models";

export class init1653530568219 implements MigrationInterface {
    name = 'init1653530568219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`enterprises\` DROP FOREIGN KEY \`FK_dbc5f5e35202deeb7486ecf5941\``);
        await queryRunner.query(`ALTER TABLE \`employes_time\` DROP FOREIGN KEY \`FK_53ca213dc8d4aaa374dc99beec8\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`enterprises\` ADD CONSTRAINT \`FK_dbc5f5e35202deeb7486ecf5941\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employes_time\` ADD CONSTRAINT \`FK_53ca213dc8d4aaa374dc99beec8\` FOREIGN KEY (\`employe_id\`) REFERENCES \`employes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    
        const admin = await queryRunner.manager.save(
            queryRunner.manager.create<User>(User, {
              email: 'admin@admin.com',
              password: await bcrypt.hash('staffing1312_*admin', 10),
              name: 'admin',
              lastname: 'admin',
              role: USER_ROLE.ADMIN,
              gender: USER_GENDER.MALE
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employes_time\` DROP FOREIGN KEY \`FK_53ca213dc8d4aaa374dc99beec8\``);
        await queryRunner.query(`ALTER TABLE \`enterprises\` DROP FOREIGN KEY \`FK_dbc5f5e35202deeb7486ecf5941\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`employes_time\` ADD CONSTRAINT \`FK_53ca213dc8d4aaa374dc99beec8\` FOREIGN KEY (\`employe_id\`) REFERENCES \`employes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`enterprises\` ADD CONSTRAINT \`FK_dbc5f5e35202deeb7486ecf5941\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
