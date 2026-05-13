import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1778584384179 implements MigrationInterface {
    name = 'AutoMigration1778584384179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`imageUrl\` varchar(10000) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`imageUrl\``);
    }

}
