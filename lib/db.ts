import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define DATABASE_URL or NEON_DATABASE_URL in your environment");
}

// Single Neon/PostgreSQL client connection.
const sql = postgres(DATABASE_URL, {
  ssl: "require",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
});

export async function connectDB() {
  return sql;
}

export { sql };
export default sql;
