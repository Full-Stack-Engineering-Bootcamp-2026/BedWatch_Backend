import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreatePatientTable
 * =============================================================================
 *
 * Creates the patients table.
 *
 * Dependencies: None
 *
 * =============================================================================
 */

export class CreatePatientTable1746500000003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE patients (
        id INT PRIMARY KEY AUTO_INCREMENT,

        name VARCHAR(255) NOT NULL,

        age INT NOT NULL,

        gender ENUM(
          'MALE',
          'FEMALE',
          'OTHER'
        ) NOT NULL,

        Reason VARCHAR(255) NOT NULL,

        Notes VARCHAR(255) NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_patients_gender
      ON patients(gender);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_patients_gender ON patients;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS patients;
    `);
  }
}