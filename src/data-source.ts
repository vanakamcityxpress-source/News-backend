import { DataSource } from "typeorm";


import "dotenv/config";
import { BreakingNews } from "./entity/BreakingNews";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,  // should be string, no conversion needed
  database: process.env.DB_DATABASE,
  entities: [BreakingNews],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
});
