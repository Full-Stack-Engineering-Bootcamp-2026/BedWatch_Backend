import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreateWardTable
 * =============================================================================
 *
 * Creates the wards table.
 *
 * Dependencies: None
 *
 * =============================================================================
 */

export class CreateWardTable1746500000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE wards (
        id INT PRIMARY KEY AUTO_INCREMENT,

        name VARCHAR(100) NOT NULL UNIQUE,

        type VARCHAR(255) NOT NULL,

        capacity INT NOT NULL,

        description TEXT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_wards_type
      ON wards(type);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_wards_type ON wards;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS wards;
    `);
  }
}