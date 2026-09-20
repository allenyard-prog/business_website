import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured.");

const pool = new pg.Pool({ connectionString, max: 1 });

try {
  const database = await pool.query("SELECT current_database() AS name, current_schema() AS schema");
  const table = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications'");
  const columns = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'applications' ORDER BY ordinal_position");
  const count = table.rowCount ? await pool.query("SELECT COUNT(*)::int AS count FROM applications") : { rows: [{ count: 0 }] };

  console.log(JSON.stringify({
    connected: true,
    database: database.rows[0].name,
    schema: database.rows[0].schema,
    applicationsTable: table.rowCount === 1 ? "available" : "missing",
    rowCount: count.rows[0].count,
    columns: columns.rows,
  }, null, 2));
} finally {
  await pool.end();
}
