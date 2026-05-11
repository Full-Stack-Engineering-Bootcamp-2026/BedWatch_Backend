import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreateTransferTable
 * =============================================================================
 *
 * Creates the transfers table.
 *
 * Dependencies:
 * - patients
 * - beds
 * - users
 *
 * =============================================================================
 */

export class CreateTransferTable1746500000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE transfers (
        id INT PRIMARY KEY AUTO_INCREMENT,

        patient_id INT NOT NULL,

        from_bed_id INT NOT NULL,

        to_bed_id INT NOT NULL,

        requested_by_id INT NULL,

        approved_by_id INT NULL,

        status ENUM(
          'PENDING',
          'APPROVED',
          'REJECTED',
          'COMPLETED'
        ) NOT NULL DEFAULT 'PENDING',

        requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        completed_at TIMESTAMP NULL,

        CONSTRAINT fk_transfers_patient
          FOREIGN KEY (patient_id)
          REFERENCES patients(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_transfers_from_bed
          FOREIGN KEY (from_bed_id)
          REFERENCES beds(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_transfers_to_bed
          FOREIGN KEY (to_bed_id)
          REFERENCES beds(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_transfers_requested_by
          FOREIGN KEY (requested_by_id)
          REFERENCES users(id)
          ON DELETE SET NULL,

        CONSTRAINT fk_transfers_approved_by
          FOREIGN KEY (approved_by_id)
          REFERENCES users(id)
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_transfers_patient_id
      ON transfers(patient_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_transfers_from_bed_id
      ON transfers(from_bed_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_transfers_to_bed_id
      ON transfers(to_bed_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_transfers_requested_by_id
      ON transfers(requested_by_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_transfers_approved_by_id
      ON transfers(approved_by_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_transfers_status
      ON transfers(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_transfers_patient_id ON transfers;
    `);

    await queryRunner.query(`
      DROP INDEX idx_transfers_from_bed_id ON transfers;
    `);

    await queryRunner.query(`
      DROP INDEX idx_transfers_to_bed_id ON transfers;
    `);

    await queryRunner.query(`
      DROP INDEX idx_transfers_requested_by_id ON transfers;
    `);

    await queryRunner.query(`
      DROP INDEX idx_transfers_approved_by_id ON transfers;
    `);

    await queryRunner.query(`
      DROP INDEX idx_transfers_status ON transfers;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS transfers;
    `);
  }
}