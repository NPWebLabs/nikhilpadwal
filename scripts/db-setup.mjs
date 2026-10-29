// Creates the tables and adds any new columns (safe to run more than once). The app also does this automatically on first request.
import nextEnv from "@next/env";
import mysql from "mysql2/promise";
import { SCHEMA, COLUMNS } from "../lib/schema.mjs";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is not set."); process.exit(1); }
const db = await mysql.createConnection({ uri: process.env.DATABASE_URL, charset: "utf8mb4" });
for (const sql of SCHEMA) await db.query(sql);
const [cols] = await db.query("SELECT TABLE_NAME AS t, COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()");
const have = new Set(cols.map((r) => `${r.t}.${r.c}`));
for (const [table, column, def] of COLUMNS) {
  if (!have.has(`${table}.${column}`)) {
    await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${def}`);
    console.log(`Added ${table}.${column}`);
  }
}
const [rows] = await db.query("SELECT COUNT(*) AS n FROM posts");
console.log(`Database ready. Posts: ${rows[0].n}`);
await db.end();
