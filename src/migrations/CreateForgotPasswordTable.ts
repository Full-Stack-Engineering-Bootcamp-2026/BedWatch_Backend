import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreateForgotPasswordTable
 * =============================================================================
 */

export class CreateForgotPasswordTable1746600000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE forgot_password (
        id INT PRIMARY KEY AUTO_INCREMENT,

        email VARCHAR(255) NOT NULL,

        token VARCHAR(255) NOT NULL,

        expires_at TIMESTAMP NOT NULL,

        created_at TIMESTAMP NOT NULL
          DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_forgot_password_email
      ON forgot_password(email);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_forgot_password_token
      ON forgot_password(token);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_forgot_password_email
      ON forgot_password;
    `);

    await queryRunner.query(`
      DROP INDEX idx_forgot_password_token
      ON forgot_password;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS forgot_password;
    `);
  }
}
