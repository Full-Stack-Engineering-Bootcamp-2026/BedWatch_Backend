import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1778355558139 implements MigrationInterface {
    name = 'AutoMigration1778355558139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_039ac2a969c02e78926031667c8\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_4f0f7f06d4de66fdf8cc3ad6c48\``);
        await queryRunner.query(`CREATE TABLE \`audit_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`action\` varchar(255) NOT NULL, \`entity_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`performedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`bed_id\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`changed_by_id\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`status\` enum ('AVAILABLE', 'OCCUPIED', 'CLEANING') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`bed_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`changed_by_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`previous_status\` enum ('AVAILABLE', 'OCCUPIED', 'CLEANING') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`new_status\` enum ('AVAILABLE', 'OCCUPIED', 'CLEANING') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`changed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`bedId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`changedById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transfers\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_039ac2a969c02e78926031667c8\` FOREIGN KEY (\`bed_id\`) REFERENCES \`beds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_4f0f7f06d4de66fdf8cc3ad6c48\` FOREIGN KEY (\`changed_by_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_1f585c662c1f11aa2e8403ebfef\` FOREIGN KEY (\`bedId\`) REFERENCES \`beds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_a12a5e96cb48f2ae77d275dc1a4\` FOREIGN KEY (\`changedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`audit_logs\` ADD CONSTRAINT \`FK_371007aca0b12c07d6d2dbdb83a\` FOREIGN KEY (\`performedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`audit_logs\` DROP FOREIGN KEY \`FK_371007aca0b12c07d6d2dbdb83a\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_a12a5e96cb48f2ae77d275dc1a4\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_1f585c662c1f11aa2e8403ebfef\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_4f0f7f06d4de66fdf8cc3ad6c48\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_039ac2a969c02e78926031667c8\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`changedById\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`bedId\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`changed_at\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`new_status\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`previous_status\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`changed_by_id\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`bed_id\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`status\` enum ('AVAILABLE', 'OCCUPIED', 'CLEANING') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`changed_by_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD \`bed_id\` int NULL`);
        await queryRunner.query(`DROP TABLE \`audit_logs\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_4f0f7f06d4de66fdf8cc3ad6c48\` FOREIGN KEY (\`changed_by_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_039ac2a969c02e78926031667c8\` FOREIGN KEY (\`bed_id\`) REFERENCES \`beds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
