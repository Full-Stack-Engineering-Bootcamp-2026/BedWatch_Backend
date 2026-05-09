import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1778257860969 implements MigrationInterface {
    name = 'AutoMigration1778257860969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_forgot_password_email\` ON \`forgot_password\``);
        await queryRunner.query(`DROP INDEX \`idx_forgot_password_token\` ON \`forgot_password\``);
        await queryRunner.query(`ALTER TABLE \`patients\` DROP COLUMN \`admittingDoctor\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`expires_at\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`expires_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP COLUMN \`expires_at\``);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD \`expires_at\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transfers\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`patients\` ADD \`admittingDoctor\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_forgot_password_token\` ON \`forgot_password\` (\`token\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_forgot_password_email\` ON \`forgot_password\` (\`email\`)`);
    }

}
