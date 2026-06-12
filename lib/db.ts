import { neon } from "@neondatabase/serverless";

// Lazy init so `next build` doesn't crash when DATABASE_URL isn't set yet
let _sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}
