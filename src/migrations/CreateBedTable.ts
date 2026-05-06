import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreateBedTable
 * =============================================================================
 *
 * Creates the beds table.
 *
 * Dependencies:
 * - wards
 *
 * =============================================================================
 */

export class CreateBedTable1746500000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE beds (
        id INT PRIMARY KEY AUTO_INCREMENT,

        ward_id INT NOT NULL,

        bed_number VARCHAR(255) NOT NULL,

        status ENUM(
          'AVAILABLE',
          'OCCUPIED',
          'CLEANING'
        ) NOT NULL DEFAULT 'AVAILABLE',

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        CONSTRAINT fk_beds_ward
          FOREIGN KEY (ward_id)
          REFERENCES wards(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_beds_ward_bed_number
          UNIQUE (ward_id, bed_number)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_beds_ward_id
      ON beds(ward_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_beds_status
      ON beds(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_beds_ward_id ON beds;
    `);

    await queryRunner.query(`
      DROP INDEX idx_beds_status ON beds;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS beds;
    `);
  }
}