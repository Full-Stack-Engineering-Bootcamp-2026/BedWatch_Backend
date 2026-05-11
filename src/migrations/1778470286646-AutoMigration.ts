import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1778470286646 implements MigrationInterface {
    name = 'AutoMigration1778470286646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`profile_image_key\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`expires_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_0aa35ab13580b27c0820f086c97\` FOREIGN KEY (\`ward_id\`) REFERENCES \`wards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_0aa35ab13580b27c0820f086c97\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`expires_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`profile_image_key\` varchar(500) NULL`);
    }

}
