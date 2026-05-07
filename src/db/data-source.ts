import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * =============================================================================
 * TypeORM DataSource Configuration - MySQL + SQL First Migrations
 * =============================================================================
 */

function getEnvBackedConnectionOptions() {
  return {
    host: process.env.DB_HOST || "localhost",

    port: parseInt(process.env.DB_PORT || "3306", 10),

    username: process.env.DB_USERNAME || "root",

    password: process.env.DB_PASSWORD || "Root@1234",

    database: process.env.DB_DATABASE || "bedwatch",

    logging: process.env.DB_LOGGING === "true",

    extra: {
      connectionLimit: parseInt(
        process.env.DB_POOL_MAX || "10",
        10
      ),
    },
  };
}

const dataSourceOptions: DataSourceOptions = {
  type: "mysql",

  ...getEnvBackedConnectionOptions(),

  /**
   * NEVER enable synchronize
   * Database schema must ONLY be managed via migrations
   */
  synchronize: false,

  /**
   * NEVER auto-run migrations automatically
   */
  migrationsRun: false,

  /**
   * Runtime entity registration
   */
  entities: [
    __dirname + "/../domains/**/entity/**/*.entity.{ts,js}",
  ],

  /**
   * Migration registration
   */
  migrations: [
    __dirname + "/../migrations/**/*.{ts,js}",
  ],

  /**
   * MySQL specific options
   */
  charset: "utf8mb4",

  timezone: "Z",
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;