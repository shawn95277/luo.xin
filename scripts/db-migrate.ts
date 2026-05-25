import { readFileSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL 未设置（请确认 .env.local 存在）");
    process.exit(1);
  }
  const sql = neon(url);
  const schemaPath = path.join(process.cwd(), "db/schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");
  const stmts = schema
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of stmts) {
    console.log("→", stmt.slice(0, 60).replace(/\s+/g, " "));
    await sql.query(stmt);
  }
  console.log("✓ schema applied");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
