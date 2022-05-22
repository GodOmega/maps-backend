import {MigrationInterface, QueryRunner} from "typeorm";

export class group1653234377397 implements MigrationInterface {
    name = 'group1653234377397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` DROP FOREIGN KEY \`FK_e1f47dc42417c508c33a96aae45\``);
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` CHANGE \`enterprises_id\` \`enterprises_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` ADD CONSTRAINT \`FK_e1f47dc42417c508c33a96aae45\` FOREIGN KEY (\`enterprises_id\`) REFERENCES \`enterprises\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` DROP FOREIGN KEY \`FK_e1f47dc42417c508c33a96aae45\``);
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` CHANGE \`enterprises_id\` \`enterprises_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`enterprise_groups\` ADD CONSTRAINT \`FK_e1f47dc42417c508c33a96aae45\` FOREIGN KEY (\`enterprises_id\`) REFERENCES \`enterprises\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
