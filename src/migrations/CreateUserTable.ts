import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * =============================================================================
 * Migration: CreateUserTable
 * =============================================================================
 *
 * Creates the users table.
 *
 * Dependencies:
 * - wards
 *
 * =============================================================================
 */

export class CreateUserTable1746500000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,

        name VARCHAR(100) NOT NULL,

        email VARCHAR(255) NOT NULL UNIQUE,

        password VARCHAR(255) NOT NULL,

        role ENUM(
          'STAFF',
          'SENIOR_STAFF',
          'ADMIN'
        ) NOT NULL,

        ward_id INT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        CONSTRAINT fk_users_ward
          FOREIGN KEY (ward_id)
          REFERENCES wards(id)
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_users_role
      ON users(role);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_users_ward_id
      ON users(ward_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_users_role ON users;
    `);

    await queryRunner.query(`
      DROP INDEX idx_users_ward_id ON users;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS users;
    `);
  }
}