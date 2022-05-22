import {MigrationInterface, QueryRunner} from "typeorm";

export class group1653228044489 implements MigrationInterface {
    name = 'group1653228044489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employes\` ADD \`enterprises_group_id\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employes\` DROP COLUMN \`enterprises_group_id\``);
    }

}
