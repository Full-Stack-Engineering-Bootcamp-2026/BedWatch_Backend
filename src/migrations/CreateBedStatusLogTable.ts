import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreateBedStatusLogTable
 * =============================================================================
 *
 * Creates the bed_status_logs table.
 *
 * Dependencies:
 * - beds
 * - users
 *
 * =============================================================================
 */

export class CreateBedStatusLogTable1746500000005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE bed_status_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,

        bed_id INT NOT NULL,

        changed_by_id INT NOT NULL,

        status ENUM(
          'AVAILABLE',
          'OCCUPIED',
          'CLEANING'
        ) NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_bed_status_logs_bed
          FOREIGN KEY (bed_id)
          REFERENCES beds(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_bed_status_logs_changed_by
          FOREIGN KEY (changed_by_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_bed_status_logs_bed_id
      ON bed_status_logs(bed_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_bed_status_logs_changed_by_id
      ON bed_status_logs(changed_by_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_bed_status_logs_status
      ON bed_status_logs(status);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_bed_status_logs_created_at
      ON bed_status_logs(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_bed_status_logs_bed_id
      ON bed_status_logs;
    `);

    await queryRunner.query(`
      DROP INDEX idx_bed_status_logs_changed_by_id
      ON bed_status_logs;
    `);

    await queryRunner.query(`
      DROP INDEX idx_bed_status_logs_status
      ON bed_status_logs;
    `);

    await queryRunner.query(`
      DROP INDEX idx_bed_status_logs_created_at
      ON bed_status_logs;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS bed_status_logs;
    `);
  }
}