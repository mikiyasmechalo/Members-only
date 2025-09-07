import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

export default new Pool({
  connectionString: process.env.DB_URL,
});
