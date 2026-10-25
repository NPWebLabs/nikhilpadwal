// Creates the tables (safe to run more than once). The app also does this automatically on first request.
import nextEnv from "@next/env";
import mysql from "mysql2/promise";
import { SCHEMA } from "../lib/schema.mjs";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is not set."); process.exit(1); }
const db = await mysql.createConnection({ uri: process.env.DATABASE_URL, charset: "utf8mb4" });
for (const sql of SCHEMA) await db.query(sql);
const [rows] = await db.query("SELECT COUNT(*) AS n FROM posts");
console.log(`Database ready. Posts: ${rows[0].n}`);
await db.end();
