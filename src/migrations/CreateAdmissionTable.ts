import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreateAdmissionTable
 * =============================================================================
 *
 * Creates the admissions table.
 *
 * Dependencies:
 * - patients
 * - beds
 * - users
 *
 * =============================================================================
 */

export class CreateAdmissionTable1746500000006
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE admissions (
        id INT PRIMARY KEY AUTO_INCREMENT,

        patient_id INT NOT NULL,

        bed_id INT NOT NULL,

        admitted_by_id INT NOT NULL,

        admitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        discharged_at TIMESTAMP NULL,

        status ENUM(
          'ACTIVE',
          'DISCHARGED'
        ) NOT NULL DEFAULT 'ACTIVE',

        CONSTRAINT fk_admissions_patient
          FOREIGN KEY (patient_id)
          REFERENCES patients(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_admissions_bed
          FOREIGN KEY (bed_id)
          REFERENCES beds(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_admissions_admitted_by
          FOREIGN KEY (admitted_by_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_admissions_patient_id
      ON admissions(patient_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_admissions_bed_id
      ON admissions(bed_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_admissions_admitted_by_id
      ON admissions(admitted_by_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_admissions_status
      ON admissions(status);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_admissions_admitted_at
      ON admissions(admitted_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_admissions_patient_id
      ON admissions;
    `);

    await queryRunner.query(`
      DROP INDEX idx_admissions_bed_id
      ON admissions;
    `);

    await queryRunner.query(`
      DROP INDEX idx_admissions_admitted_by_id
      ON admissions;
    `);

    await queryRunner.query(`
      DROP INDEX idx_admissions_status
      ON admissions;
    `);

    await queryRunner.query(`
      DROP INDEX idx_admissions_admitted_at
      ON admissions;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS admissions;
    `);
  }
}