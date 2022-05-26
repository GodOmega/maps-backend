import {MigrationInterface, QueryRunner} from "typeorm";
import * as bcrypt from 'bcrypt'

import { User } from "src/users/entities/user.entity";
import { USER_ROLE, USER_GENDER } from "src/users/models/user.models";


export class init1653541018731 implements MigrationInterface {
    name = 'init1653541018731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`gender\` enum ('M', 'F', 'O') NOT NULL, \`role\` enum ('admin', 'worker', 'owner') NOT NULL DEFAULT 'worker', \`image\` text NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`enterprises\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employes_time\` (\`id\` int NOT NULL AUTO_INCREMENT, \`client_id\` varchar(255) NOT NULL, \`uuid\` text NOT NULL, \`status\` enum ('online', 'offline', 'lunch', 'endlunch') NOT NULL DEFAULT 'online', \`time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`employe_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` enum ('worker', 'onwer') NOT NULL DEFAULT 'worker', \`enterprises_id\` int NULL, \`users_id\` int NOT NULL, \`enterprise_group_id\` int NULL, UNIQUE INDEX \`REL_94a37068ba44def928303a5c54\` (\`users_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`enterprise_groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`perimeter\` text NULL, \`enterprises_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`enterprises\` ADD CONSTRAINT \`FK_dbc5f5e35202deeb7486ecf5941\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employes_time\` ADD CONSTRAINT \`FK_53ca213dc8d4aaa374dc99beec8\` FOREIGN KEY (\`employe_id\`) REFERENCES \`employes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employes\` ADD CONSTRAINT \`FK_80bbb24663bd8322db4cdd0e916\` FOREIGN KEY (\`enterprises_id\`) REFERENCES \`enterprises\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employes\` ADD CONSTRAINT \`FK_94a37068ba44def928303a5c54d\` FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employes\` ADD CONSTRAINT \`FK_6540c0a97ee32c831db9c227cc6\` FOREIGN KEY (\`enterprise_group_id\`) REFERENCES \`enterprise_groups\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` ADD CONSTRAINT \`FK_e1f47dc42417c508c33a96aae45\` FOREIGN KEY (\`enterprises_id\`) REFERENCES \`enterprises\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
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
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` DROP FOREIGN KEY \`FK_e1f47dc42417c508c33a96aae45\``);
        await queryRunner.query(`ALTER TABLE \`employes\` DROP FOREIGN KEY \`FK_6540c0a97ee32c831db9c227cc6\``);
        await queryRunner.query(`ALTER TABLE \`employes\` DROP FOREIGN KEY \`FK_94a37068ba44def928303a5c54d\``);
        await queryRunner.query(`ALTER TABLE \`employes\` DROP FOREIGN KEY \`FK_80bbb24663bd8322db4cdd0e916\``);
        await queryRunner.query(`ALTER TABLE \`employes_time\` DROP FOREIGN KEY \`FK_53ca213dc8d4aaa374dc99beec8\``);
        await queryRunner.query(`ALTER TABLE \`enterprises\` DROP FOREIGN KEY \`FK_dbc5f5e35202deeb7486ecf5941\``);
        await queryRunner.query(`DROP TABLE \`enterprise_groups\``);
        await queryRunner.query(`DROP INDEX \`REL_94a37068ba44def928303a5c54\` ON \`employes\``);
        await queryRunner.query(`DROP TABLE \`employes\``);
        await queryRunner.query(`DROP TABLE \`employes_time\``);
        await queryRunner.query(`DROP TABLE \`enterprises\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
