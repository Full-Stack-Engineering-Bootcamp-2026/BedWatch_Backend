import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1778424005825 implements MigrationInterface {
    name = 'AutoMigration1778424005825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_d5b5ae072248834f4b95adabdf7\``);
        await queryRunner.query(`DROP INDEX \`idx_forgot_password_email\` ON \`forgot_password\``);
        await queryRunner.query(`DROP INDEX \`idx_forgot_password_token\` ON \`forgot_password\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`wardId\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`profile_image_key\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`ward_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transfers\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`expires_at\``);
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
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`expires_at\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transfers\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`ward_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`profile_image_key\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`wardId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_forgot_password_token\` ON \`forgot_password\` (\`token\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_forgot_password_email\` ON \`forgot_password\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_d5b5ae072248834f4b95adabdf7\` FOREIGN KEY (\`wardId\`) REFERENCES \`wards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
