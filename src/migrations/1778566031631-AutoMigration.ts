import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1778566031631 implements MigrationInterface {
    name = 'AutoMigration1778566031631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`patients\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`age\` int NOT NULL, \`gender\` enum ('MALE', 'FEMALE', 'OTHER') NOT NULL, \`reason\` varchar(255) NOT NULL, \`notes\` varchar(255) NOT NULL, \`admittingDoctor\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('STAFF', 'SENIOR_STAFF', 'ADMIN') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ward_id\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`admitted_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`discharged_at\` timestamp NULL, \`status\` enum ('ACTIVE', 'DISCHARGED') NOT NULL DEFAULT 'ACTIVE', \`patientId\` int NULL, \`bedId\` int NULL, \`admittedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bed_status_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('AVAILABLE', 'OCCUPIED', 'CLEANING') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`bed_id\` int NULL, \`changed_by_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`beds\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bed_number\` varchar(255) NOT NULL, \`status\` enum ('AVAILABLE', 'OCCUPIED', 'CLEANING') NOT NULL DEFAULT 'AVAILABLE', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`wardId\` int NULL, UNIQUE INDEX \`IDX_bbb0fb0fb6f6f8e936ff3b3bc9\` (\`wardId\`, \`bed_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wards\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`type\` varchar(255) NOT NULL, \`capacity\` int NOT NULL, \`description\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5a722ad2f076304832fa3d80af\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transfers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING', \`requested_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`completed_at\` timestamp NULL, \`patientId\` int NULL, \`fromBedId\` int NULL, \`toBedId\` int NULL, \`requestedById\` int NULL, \`approvedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`forgot_password\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_0aa35ab13580b27c0820f086c97\` FOREIGN KEY (\`ward_id\`) REFERENCES \`wards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admissions\` ADD CONSTRAINT \`FK_f9d5de8d7dd020123a3c76f0a2e\` FOREIGN KEY (\`patientId\`) REFERENCES \`patients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admissions\` ADD CONSTRAINT \`FK_e9eac43b40763c55ca076e4d011\` FOREIGN KEY (\`bedId\`) REFERENCES \`beds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admissions\` ADD CONSTRAINT \`FK_6515e5bb9805a58aa4bba8cdd84\` FOREIGN KEY (\`admittedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_039ac2a969c02e78926031667c8\` FOREIGN KEY (\`bed_id\`) REFERENCES \`beds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` ADD CONSTRAINT \`FK_4f0f7f06d4de66fdf8cc3ad6c48\` FOREIGN KEY (\`changed_by_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`beds\` ADD CONSTRAINT \`FK_12c4b045ef8d740bb4fe8051429\` FOREIGN KEY (\`wardId\`) REFERENCES \`wards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_4b2c15e8e9c45e2f0465bc9ad83\` FOREIGN KEY (\`patientId\`) REFERENCES \`patients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_a14bd6ae2274ba282629be67af2\` FOREIGN KEY (\`fromBedId\`) REFERENCES \`beds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_fd063f9e802d99cd4f57df808b8\` FOREIGN KEY (\`toBedId\`) REFERENCES \`beds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_430639757119b0424fd51d78f4b\` FOREIGN KEY (\`requestedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_bea0014a61ad163994ef7827134\` FOREIGN KEY (\`approvedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_bea0014a61ad163994ef7827134\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_430639757119b0424fd51d78f4b\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_fd063f9e802d99cd4f57df808b8\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_a14bd6ae2274ba282629be67af2\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_4b2c15e8e9c45e2f0465bc9ad83\``);
        await queryRunner.query(`ALTER TABLE \`beds\` DROP FOREIGN KEY \`FK_12c4b045ef8d740bb4fe8051429\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_4f0f7f06d4de66fdf8cc3ad6c48\``);
        await queryRunner.query(`ALTER TABLE \`bed_status_logs\` DROP FOREIGN KEY \`FK_039ac2a969c02e78926031667c8\``);
        await queryRunner.query(`ALTER TABLE \`admissions\` DROP FOREIGN KEY \`FK_6515e5bb9805a58aa4bba8cdd84\``);
        await queryRunner.query(`ALTER TABLE \`admissions\` DROP FOREIGN KEY \`FK_e9eac43b40763c55ca076e4d011\``);
        await queryRunner.query(`ALTER TABLE \`admissions\` DROP FOREIGN KEY \`FK_f9d5de8d7dd020123a3c76f0a2e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_0aa35ab13580b27c0820f086c97\``);
        await queryRunner.query(`DROP TABLE \`forgot_password\``);
        await queryRunner.query(`DROP TABLE \`transfers\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a722ad2f076304832fa3d80af\` ON \`wards\``);
        await queryRunner.query(`DROP TABLE \`wards\``);
        await queryRunner.query(`DROP INDEX \`IDX_bbb0fb0fb6f6f8e936ff3b3bc9\` ON \`beds\``);
        await queryRunner.query(`DROP TABLE \`beds\``);
        await queryRunner.query(`DROP TABLE \`bed_status_logs\``);
        await queryRunner.query(`DROP TABLE \`admissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`patients\``);
    }

}
